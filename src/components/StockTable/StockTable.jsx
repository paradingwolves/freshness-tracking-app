import React, { useEffect, useState } from 'react';
import { addDays, isBefore, isToday } from 'date-fns';
import Loading from '../Loading/Loading';
import useAllStockData from "../../hooks/ViewStock";
import FilterSelect from "./FilterSelect";
import SearchBar from './SearchBar';
import useUpdateQuantityToZero from '../../hooks/RemoveStock';
import { Link } from 'react-router-dom';
import './StockTable.css';

const StockTable = () => {
    const { stockData: fetchedStockData, loading } = useAllStockData(); // Use a different name for the fetched stockData
    const [sortedStockData, setSortedStockData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(30);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [shortenName, setShortenName] = useState(false);
    const { updateQuantityToZero, isLoading } = useUpdateQuantityToZero();
    const [selectedProductIndex, setSelectedProductIndex] = useState(null);

    const exp90days = addDays(new Date(), 90);
    const exp7days = addDays(new Date(), 7);
    const expToday = addDays(new Date(), 1);
    const today = new Date();

    useEffect(() => {
        if(!loading && fetchedStockData.length > 0) {
            const sortedData = [...fetchedStockData].sort((a, b) =>
                new Date(a.expiry_date) - new Date(b.expiry_date)
            );

            // Update the sortedStockData state with the sorted data
            setSortedStockData(sortedData);
        }
    }, [fetchedStockData, loading]);

    // Shortened name for mobile view handler
    useEffect(() => {
        const handleResize = () => {
            setShortenName(window.innerWidth > 1);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const getShortenedName = (product) => {
        if(shortenName) {
            const words = product.name.split(' ');
            const brandWords = product.brand.split(' ');
            const filteredWords = words.filter(word => !brandWords.includes(word));
            return filteredWords.join(' ');
        }
        return product.name;
    };

    // Function to calculate the "Red Sticker" value based on the 'updated' property
    const calculateRedStickerValue = (updatedValue) => {
        switch (updatedValue) {
            case 0:
                return '00%';
            case 1:
                return '20%';
            case 2:
                return '35%';
            case 3:
                return '50%';
            default:
                return ''; // Handle other cases as needed
        }
    };

    // Apply both filter and pagination
    const applyFiltersAndPagination = (data) => {
        const numberPattern = /\d+/;
        const query = searchQuery.toLowerCase();

        return data
        .filter((product) => {
            const itemNumber = product.item_number.toString();
            return (
            (numberPattern.test(itemNumber) && itemNumber.includes(query)) ||
            product.name.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query)
            );
        })
        .filter((product) => {
            const expiryDate = new Date(product.expiry_date);

            switch (selectedFilter) {
            case '90days':
                return expiryDate <= exp90days && expiryDate > exp7days;
            case '7days':
                return expiryDate <= exp7days && !isToday(expiryDate);
            case '1day':
                return expiryDate.getTime() === expToday.getTime();
            case 'past':
                return isBefore(expiryDate, today);
            default:
                return true; // Return true for 'all'
            }
        });
    };

    // expiry date filter
    const filterOptions = [
        { label: 'All', value: 'all' },
        { label: 'Expires in 90 Days', value: '90days' },
        { label: 'Expires in 7 Days', value: '7days' },
        { label: 'Expires Today', value: '1day' },
        { label: 'Expired', value: 'past' },
    ];
  const filteredAndPaginatedData = applyFiltersAndPagination(sortedStockData);
  const totalPages = Math.ceil(filteredAndPaginatedData.length / rowsPerPage);
  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;
  const currentData = filteredAndPaginatedData.slice(firstIndex, lastIndex);


/*     // Pagination variables
    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;
    const currentData = sortedStockData.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(sortedStockData.length / rowsPerPage);
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    
    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    };
    // search filter
    let filteredData = currentData;
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const numberPattern = /\d+/; // Regular expression to match numbers
        filteredData = filteredData.filter((product) => {
            const itemNumber = product.item_number.toString(); // Ensure item_number is a string
            return (
                (numberPattern.test(itemNumber) && itemNumber.includes(query)) ||
                product.name.toLowerCase().includes(query) ||
                product.brand.toLowerCase().includes(query)
            );
        });
    }

    // expiry date filter
    const filterOptions = [
        { label: 'All', value: 'all' },
        { label: 'Expires in 90 Days', value: '90days' },
        { label: 'Expires in 7 Days', value: '7days' },
        { label: 'Expires Today', value: '1day' },
        { label: 'Expired', value: 'past' },
    ];
    const handleFilterChange = (value) => {
        setSelectedFilter(value);
    };
    switch(selectedFilter) {
        case '90days':
            filteredData = filteredData.filter((product) => {
                const expiryDate = new Date(product.expiry_date);
                return expiryDate <= exp90days && expiryDate > exp7days;
            });
        break;
        case '7days':
            filteredData = filteredData.filter((product) => {
                const expiryDate = new Date(product.expiry_date);
                return expiryDate <= exp7days && !isToday(expiryDate);
            });
            break;
        case '1day':
            filteredData = filteredData.filter((product) =>
                new Date(product.expiry_date) === expToday
            );
            break;
        case 'past':
            filteredData = filteredData.filter((product) =>
                isBefore(new Date(product.expiry_date), today)
            );
            break;
        default:
            break;
    }
 */


    // Delete Button
    const handleDelete = (product) => {
        // Call the updateQuantityToZero function from the hook
        updateQuantityToZero(product.name, product.expiry_date);
    };

    // loading
    if (loading) {
        <Loading />
    }
    if (sortedStockData.length === 0) { // Check sortedStockData for empty data
        return <p>No stock data available.</p>;
    }

    return (
        <div className="list-table-container">
            <div className="table-controls">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                <FilterSelect
                    options={filterOptions}
                    value={selectedFilter}
                    onChange={(value) => setSelectedFilter(value)} 
                />
            </div>
            <div className="table-responsive listTable-container">
            <div>
                <ul className="table-striped stock-table listTable">
                <li className="stock-head list-header list-row">
                    <div className="list-cell list-cell-id">ID</div>
                    <div className="list-cell list-cell-name">Name</div>
                    <div className="list-cell list-cell-brand">Brand</div>
                    <div className="list-cell list-cell-red">Red Sticker</div>
                    <div className="list-cell list-cell-qty">Qty.</div>
                    <div className="list-cell list-cell-date">Exp.</div>
                </li>
                {currentData.map((product, index) => {
                    // Determine the class name based on the expiry date
                    let className = '';
                    const expiryDate = new Date(product.expiry_date);
                    const today = new Date();
                    const ninetyDaysFromNow = addDays(today, 90);
                    const oneWeekFromNow = addDays(today, 7);

                    if (isBefore(expiryDate, today)) {
                        className = 'exp-past';
                    } else if (isToday(expiryDate)) {
                        className = 'exp-today';
                    } else if (isBefore(expiryDate, oneWeekFromNow)) {
                        className = 'exp-week';
                    } else if (isBefore(expiryDate, ninetyDaysFromNow)) {
                        className = 'exp-soon';
                    }

                    return (
                        <li
                        key={product.id}
                        className={`list-row ${className}`}
                        onClick={() => {
                            if (selectedProductIndex === index) {
                            // If the button is already visible, hide it
                            setSelectedProductIndex(null);
                            } else {
                            // Otherwise, show the button for the clicked product
                            setSelectedProductIndex(index);
                            }
                        }}
                        >
                        <div className={`stock-delete ${selectedProductIndex === index ? 'visible' : ''}`}>
                            <button onClick={() => handleDelete(product)}>Remove Product</button>
                        </div>
                        <div className={`list-cell list-cell-id ${shortenName ? 'shortened-name' : ''}`}>
                            {product.item_number}
                        </div>
                        <div className={`list-cell list-cell-name ${shortenName ? 'shortened-name' : ''}`}>
                            <Link className='text-dark text-decoration-none' to={`/edit_stock/${product.id}`}>
                            {getShortenedName(product)}
                            </Link>
                        </div>
                        <div className="list-cell list-cell-brand">{product.brand}</div>
                        <div className="list-cell list-cell-red">{calculateRedStickerValue(product.updated)}</div>
                        <div className="list-cell list-cell-qty">{product.quantity}</div>
                        <div className="list-cell list-cell-date">{product.expiry_date}</div>
                        </li>
                    );
                    })}

                </ul>
            </div>
            <div className="pagination-container">
                    <div className="rows-per-page">
                        <label>Results per page:</label>
                        <select
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                            className='select'
                        >
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                    <div className="pagination">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &laquo;
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                                className={currentPage === index + 1 ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            &raquo;
                        </button>
                </div>
            </div>
        </div>
    </div>

    );
};

export default StockTable;

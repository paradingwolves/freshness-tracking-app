import React, { useEffect, useState } from 'react';
import { addDays, isBefore, isToday } from 'date-fns';
import useAllStockData from "../../hooks/ViewStock";
import FilterSelect from "./FilterSelect";
import SearchBar from './SearchBar';
import { addDays, isBefore, isToday } from 'date-fns';
import './StockTable.css';

const StockTable = () => {
    const { stockData, loading } = useAllStockData();
    const [sortedStockData, setSortedStockData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(30);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [shortenName, setShortenName] = useState(false);
    const [hoveredRow, setHoveredRow] = useState(null);

    useEffect(() => {
        if(!loading && stockData.length > 0) {
            const sortedData = [...stockData].sort((a, b) =>
                new Date(a.expiry_date) - new Date(b.expiry_date)
            );

            // Update the sortedStockData state with the sorted data
            setSortedStockData(sortedData);
        }
    }, [stockData, loading]);

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

    // Pagination variables
    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;
    const currentData = sortedStockData.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(sortedStockData.length / rowsPerPage);
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    };

    // Function to calculate the "Red Sticker" value based on the 'updated' property
    const calculateRedStickerValue = (updatedValue) => {
        switch (updatedValue) {
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

    // search filter
    let filteredData = sortedStockData;
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
    const exp90days = addDays(new Date(), 90);
    const exp7days = addDays(new Date(), 7);
    const expToday = addDays(new Date(), 1);
    const today = new Date();
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

    // Delete Button
    const handleDelete = (product) => { console.log(`You just clicked the Delete button for ${product.name}`); };
    const handleRowHover = (index) => { setHoveredRow(index); };
    const handleRowLeave = () => {setHoveredRow(null); };

    // loading
    if (loading) {
        return <p>Loading...</p>;
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
                    onChange={handleFilterChange} 
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
                {filteredData.map((product, index) => {
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
                            key={product.id} className={`list-row ${className}`}
                            onClick={() => { handleRowHover(index); }} 
                            // onMouseEnter={() => handleRowHover(index)}
                            // onMouseLeave={handleRowLeave}
                        >
                            <div className={`stock-delete ${hoveredRow === index ? 'visible' : ''}`}>
                                <button onClick={() => handleDelete(product)}>Your Button</button>
                            </div>
                            <div className={`list-cell list-cell-id ${shortenName ? 'shortened-name' : ''}`}>
                            {product.item_number}
                            </div>
                            <div className={`list-cell list-cell-name ${shortenName ? 'shortened-name' : ''}`}>
                            {getShortenedName(product)}
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
                        onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                        className='select'
                        >
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}>&laquo;
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}>
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}>&raquo;
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
};

export default StockTable;

import React, { useEffect, useState } from 'react';
import useAllStockData from "../../hooks/ViewStock";
import { addDays, isBefore, isAfter, isToday } from 'date-fns';
import './StockTable.css';

const StockTable = () => {
    const { stockData, loading } = useAllStockData();
    const [sortedStockData, setSortedStockData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(30);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    useEffect(() => {
        if(!loading && stockData.length > 0) {
            const sortedData = [...stockData].sort((a, b) =>
                new Date(a.expiry_date) - new Date(b.expiry_date)
            );

            // Update the sortedStockData state with the sorted data
            setSortedStockData(sortedData);
        }
    }, [stockData, loading]);

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

    // search filter
    let filteredData = sortedStockData;
    if(searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredData = filteredData.filter((product) =>
            product.id.includes(query) ||
            product.name.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query)
        );
    }

    // expiry date filter
    if(selectedFilter === '90days') {
        const expSoon = addDays(new Date(), 90);
        filteredData = filteredData.filter((product) =>
            new Date(product.expiry_date) <= expSoon
        );
    } else if(selectedFilter === '7days') {
        const expWeek = addDays(new Date(), 7);
        filteredData = filteredData.filter((product) =>
            new Date(product.expiry_date) <= expWeek
        );
    } else if(selectedFilter === '1day') {
        const expToday = addDays(new Date(), 1);
        filteredData = filteredData.filter((product) =>
            new Date(product.expiry_date) <= expToday
        );
    } else if(selectedFilter === 'past') {
        const expPast = new Date();
        filteredData = filteredData.filter((product) =>
            new Date(product.expiry_date) <= expPast
        );
    }

    if (loading) {
        return <p>Loading...</p>;
    }
    if (sortedStockData.length === 0) { // Check sortedStockData for empty data
        return <p>No stock data available.</p>;
    }


    return (
        <div className="table-container">
            <div className="table-controls">
                <div className="search-control">
                    <input
                        type="text"
                        placeholder="Search by IS, name, or brand"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-control">
                    <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="90days">Expires in 90 Days</option>
                        <option value="7days">Expires in 7 Days</option>
                        <option value="1day">Expires in 1 Day</option>
                        <option value="past">Expired</option>
                    </select>
                </div>
            </div>
            <div className="table-responsive">
            <table className="table-striped stock-table">
                <thead>
                <tr className="stock-head">
                    {/* <th>ID</th> */}
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Quantity</th>
                    <th>Expiry Date</th>
                </tr>
                </thead>
                <tbody>
                {filteredData.map((product) => {
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
                        <tr key={product.id} className={className}>
                            {/* <td>{product.id}</td> */}
                            {/* Need to get accurate callback for Product # */}
                            <td>{product.name}</td>
                            <td>{product.brand}</td>
                            <td>{product.quantity}</td>
                            <td>{product.expiry_date}</td>
                        </tr>
                    );

                })}
                </tbody>
            </table>

            <div className="pagination-container">
                <div className="rows-per-page">
                    <label>Results per page:</label>
                    <select onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}>
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

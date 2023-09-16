import React, { useEffect, useState } from 'react';
import useAllStockData from "../../hooks/ViewStock";
import { addDays, isBefore, isAfter, isToday } from 'date-fns';
import './StockTable.css';

const StockTable = () => {
    const { stockData, loading } = useAllStockData();
    const [sortedStockData, setSortedStockData] = useState([]);

    useEffect(() => {
        if(!loading && stockData.length > 0) {
            const sortedData = [...stockData].sort((a, b) =>
                new Date(a.expiry_date) - new Date(b.expiry_date)
            );

            // Update the sortedStockData state with the sorted data
            setSortedStockData(sortedData);
        }
    }, [stockData, loading]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (sortedStockData.length === 0) { // Check sortedStockData for empty data
        return <p>No stock data available.</p>;
    }

    return (
        <div className="table-responsive">
            <table className="table-striped stock-table">
                <thead>
                <tr className="stock-head">
                    {/* <th>ID</th> */}
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Expiry Date</th>
                </tr>
                </thead>
                <tbody>
                {sortedStockData.map((product) => {
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
                            <td>{product.expiry_date}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default StockTable;

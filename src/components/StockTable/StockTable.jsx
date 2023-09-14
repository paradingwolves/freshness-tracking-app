import React from 'react';
import useAllStockData from "../../hooks/ViewStock";

const StockTable = () => {
    const { stockData, loading } = useAllStockData();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (stockData.length === 0) {
        return <p>No stock data available.</p>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Expiry Date</th>
                </tr>
                </thead>
                <tbody>
                {stockData.map((product) => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        {/* Need to get accurate callback for Product # */}
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.expiry_date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockTable;

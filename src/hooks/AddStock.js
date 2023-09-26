// useAddStock.js
import { useState } from 'react';

const useAddStock = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const selectItem = (item) => {
    setSelectedItem(item);
  };

  const clearSelectedItem = () => {
    setSelectedItem(null);
  };

  const updateStockQuantity = (newQuantity) => {
    // Implement the logic to update the stock quantity here
    // You can use Firebase or any other method to update the quantity
    // This is just a placeholder function
    console.log('Updating stock quantity:', newQuantity);
  };

  return {
    selectedItem,
    selectItem,
    clearSelectedItem,
    updateStockQuantity,
  };
};

export default useAddStock;

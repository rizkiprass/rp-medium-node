// utils/helpers.js

function calculateTotalAmount(cartItems) {
    return cartItems.reduce((total, item) => {
      return total + item.Quantity * item.Price;
    }, 0);
  }
  
  module.exports = {
    calculateTotalAmount,
  };
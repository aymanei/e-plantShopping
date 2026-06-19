import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from './CartSlice';
import { useNavigate } from 'react-router-dom';
import './CartItem.css';

const CartItem = ({ onContinueShopping }) => {
  // Retrieve cart array from Redux store state
  const cart = useSelector(state => state.cart.items) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Helper function to safely extract a numeric value from the cost string.
   * Handles string formats like "$15" or raw numbers gracefully.
   */
  const parseCost = (costString) => {
    if (typeof costString === 'number') return costString;
    // Remove any dollar signs or extra characters and convert to a float
    return parseFloat(costString.replace(/[^0-9.]/g, '')) || 0;
  };

  /**
   * Calculates the grand total amount for all unique products currently in the cart.
   * Updates instantaneously whenever item quantity or existence shifts.
   */
  const calculateTotalAmount = () => {
    const total = cart.reduce((accumulatedTotal, item) => {
      const numericalCost = parseCost(item.cost);
      return accumulatedTotal + (numericalCost * item.quantity);
    }, 0);
    return `$${total.toFixed(2)}`; // Returns beautifully formatted currency
  };

  /**
   * Calculates the total cost for a specific item row based on its unit price and quantity.
   */
  const calculateTotalCost = (item) => {
    const numericalCost = parseCost(item.cost);
    return `$${(numericalCost * item.quantity).toFixed(2)}`;
  };

  /**
   * Handles returning to the main plant catalog view.
   * Uses parent state trigger if supplied, or fallbacks to React Router path.
   */
  const handleContinueShopping = (e) => {
    e.preventDefault();
    if (onContinueShopping) {
      onContinueShopping();
    } else {
      navigate('/products');
    }
  };

  /**
   * Dispatches increment action to boost target item quantity by +1.
   */
  const handleIncrement = (item) => {
    // Note: Assuming matching condition by item.name if standard IDs aren't present in plant arrays
    const identifier = item.id || item.name;
    dispatch(updateQuantity({ id: identifier, quantity: item.quantity + 1 }));
  };

  /**
   * Dispatches decrement action to reduce target item quantity by -1,
   * keeping the floor bounded strictly at 1 item.
   */
  const handleDecrement = (item) => {
    const identifier = item.id || item.name;
    if (item.quantity > 1) {
      dispatch(updateQuantity({ id: identifier, quantity: item.quantity - 1 }));
    } else {
      // Optional: You can choose to auto-delete the item if decrementing past 1
      dispatch(removeItem(identifier));
    }
  };

  /**
   * Dispatches global remove action to scrub item out of cart slice arrays completely.
   */
  const handleRemove = (item) => {
    const identifier = item.id || item.name;
    dispatch(removeItem(identifier));
  };

  const handleCheckout = () => {
    alert("Checkout feature coming soon!");
  };

  return (
    <div className="cart-container">
      {/* Grand Total Dynamic Display Header */}
      <h2 style={{ color: 'black', textAlign: 'center', marginBottom: '30px' }}>
        Total Cart Amount: {calculateTotalAmount()}
      </h2>
      
      {/* Main Cart Items Grid Map Loop */}
      <div className="cart-items-list">
        {cart.map(item => (
          <div className="cart-item" key={item.id || item.name}>
            <div className="cart-item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="cart-item-details">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-cost">{item.cost}</div>
              
              <div className="cart-item-quantity">
                {/* Quantity Controls Section */}
                <button 
                  className="cart-item-button cart-item-button-dec" 
                  onClick={() => handleDecrement(item)}
                >-</button>
                <span className="cart-item-quantity-value">{item.quantity}</span>
                <button 
                  className="cart-item-button cart-item-button-inc" 
                  onClick={() => handleIncrement(item)}
                >+</button>
                
                {/* Sub-total Display Column for Individual Plant Tally */}
                <div className="cart-item-total">
                  Subtotal: {calculateTotalCost(item)}
                </div>
                
                {/* Delete Entry Control Action */}
                <button className="cart-item-delete" onClick={() => handleRemove(item)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Primary Action Buttons Container Footer */}
      <div className="cart-actions-footer" style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button className="continue_shopping_btn" onClick={handleContinueShopping}>
          Continue Shopping
        </button>
        <button className="get-started-button" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartItem;

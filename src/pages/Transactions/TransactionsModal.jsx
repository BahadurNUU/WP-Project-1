import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./TransactionsModal.css";

const TransactionsModal = ({ isOpen, onClose, onSave }) => {
  // Form state management
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    date: ""
  });

  // UI state management
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const dropdownRef = useRef(null);

  // Transaction categories
  const categories = [
    "Entertainment", "Bills", "Groceries", "Dining Out",
    "Transportation", "Personal Care", "Education",
    "Lifestyle", "Shopping", "General"
  ];

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format date to 'MM/DD/YYYY' for consistent input display
  const formatDate = (inputDate) => {
    const dateObj = new Date(inputDate);
    return isNaN(dateObj) ? "" : dateObj.toLocaleDateString("en-US");
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.date);
    selectedDate.setHours(0, 0, 0, 0);
    const minDate = new Date("2000-01-01");

    if (!formData.name.trim()) newErrors.name = "Transaction name is required.";
    if (!formData.amount.trim() || isNaN(formData.amount)) newErrors.amount = "Enter a valid amount.";
    if (!formData.category) newErrors.category = "Please select a category.";
    if (!formData.date) {
      newErrors.date = "Please select a date.";
    } else if (selectedDate > today) {
      newErrors.date = "Future dates are not allowed.";
    } else if (selectedDate < minDate) {
      newErrors.date = "Year is too old.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission and save the transaction
  const handleSubmit = () => {
    if (!validateForm()) return;

    onSave({ 
      name: formData.name, 
      amount: parseFloat(formData.amount), 
      category: formData.category, 
      date: formatDate(formData.date) 
    });

    handleClose();  
  };

  // Reset form and close modal
  const handleClose = () => {
    setFormData({
      name: "",
      amount: "",
      category: "",
      date: ""
    });
    setErrors({});
    setShowDropdown(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Add Transaction</h2>
          <button className="close-btn" onClick={handleClose}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="16" x2="16" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Transaction Name */}
          <label>Transaction Name</label>
          <input
            type="text"
            placeholder="e.g. Coffee at Starbucks"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

          {/* Amount */}
          <label>Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          {errors.amount && <p className="error-text">{errors.amount}</p>}

          {/* Category Dropdown */}
          <label>Category</label>
          <div className="dropdown" ref={dropdownRef}>
            <div className="dropdown-selected" onClick={() => setShowDropdown(!showDropdown)}>
              {formData.category || "Select Category"}
              <span className="arrow">&#9662;</span>
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                {categories.map((cat) => (
                  <div key={cat} className="dropdown-item" onClick={() => {
                    setFormData({ ...formData, category: cat });
                    setShowDropdown(false);
                  }}>
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.category && <p className="error-text">{errors.category}</p>}

          {/* Date Picker */}
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          {errors.date && <p className="error-text">{errors.date}</p>}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="save-btn" onClick={handleSubmit}>
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

// Prop type validation
TransactionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default TransactionsModal;

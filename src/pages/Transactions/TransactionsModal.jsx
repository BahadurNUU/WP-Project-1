import React, { useState, useRef, useEffect } from "react";
import "./TransactionsModal.css";

const TransactionsModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const dropdownRef = useRef(null);

  const categories = [
    "Entertainment", "Bills", "Groceries", "Dining Out",
    "Transportation", "Personal Care", "Education",
    "Lifestyle", "Shopping", "General"
  ];

  {/* Handle clicks outside dropdown to close it */}
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  {/* Format date for display */}
  const formatDate = (inputDate) => {
    const dateObj = new Date(inputDate);
    return isNaN(dateObj) ? "" : dateObj.toLocaleDateString("en-US");
  };

  {/* Validate form inputs */}
  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const minDate = new Date("2000-01-01");

    if (!name.trim()) newErrors.name = "Transaction name is required.";
    if (!amount.trim() || isNaN(amount)) newErrors.amount = "Enter a valid amount.";
    if (!category) newErrors.category = "Please select a category.";
    if (!date) {
      newErrors.date = "Please select a date.";
    } else if (selectedDate > today) {
      newErrors.date = "Future dates are not allowed.";
    } else if (selectedDate < minDate) {
      newErrors.date = "Year is too old.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  {/* Handle form submission */}
  const handleSubmit = () => {
    if (!validateForm()) return;

    onSave({ 
      name, 
      amount: parseFloat(amount), 
      category, 
      date: formatDate(date) 
    });

    handleClose();  
  };

  {/* Reset form and close modal */}
  const handleClose = () => {
    setName("");
    setAmount("");
    setCategory("");
    setDate("");
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

          {/* Amount */}
          <label>Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {errors.amount && <p className="error-text">{errors.amount}</p>}

          {/* Category Dropdown */}
          <label>Category</label>
          <div className="dropdown" ref={dropdownRef}>
            <div className="dropdown-selected" onClick={() => setShowDropdown(!showDropdown)}>
              {category || "Select Category"}
              <span className="arrow">&#9662;</span>
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                {categories.map((cat) => (
                  <div key={cat} className="dropdown-item" onClick={() => {
                    setCategory(cat);
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
            value={date}
            onChange={(e) => setDate(e.target.value)}
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

export default TransactionsModal;

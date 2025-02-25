import React, { useState, useEffect } from "react";
import { useFinanceData } from "../../context/FinanceContext";
import TransactionsModal from "./TransactionsModal";
import "./TransactionsPage.css";

const TransactionsPage = () => {
  // State to store all transactions and filtered transactions
  const { data, loaded } = useFinanceData();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // State for search, category filter, sorting, pagination, and modal visibility
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Transactions");
  const [sortBy, setSortBy] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Number of transactions displayed per page
  const transactionsPerPage = 10;

  // Fetch transactions from context when data is loaded
  useEffect(() => {
    if (loaded && data?.transactions) {
      setTransactions(data.transactions);
      setFilteredTransactions(data.transactions);
    }
  }, [loaded, data]);

  // Filter, sort, and update transactions whenever relevant state changes
  useEffect(() => {
    // Filter by search term and category
    let filtered = transactions
      .filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((t) => category === "All Transactions" || t.category === category);

    // Sorting logic using various criteria
    const sortFunctions = {
      Latest: (a, b) => new Date(b.date) - new Date(a.date),
      Oldest: (a, b) => new Date(a.date) - new Date(b.date),
      "A to Z": (a, b) => a.name.localeCompare(b.name),
      "Z to A": (a, b) => b.name.localeCompare(a.name),
      Highest: (a, b) => b.amount - a.amount,
      Lowest: (a, b) => a.amount - b.amount,
    };

    // Apply sorting and update filtered transactions
    setFilteredTransactions(filtered.sort(sortFunctions[sortBy]));

    // Reset to first page when filters/sorting are changed
    setCurrentPage(1);
  }, [transactions, searchTerm, category, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const displayedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  // Helper function to format date strings to 'DD/MM/YYYY'
  const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString("en-GB");

  // Add a new transaction and close the modal
  const handleSaveTransaction = (newTransaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="transactions-container">
      {/* Header Section */}
      <div className="transactions-header">
        <h2>Transactions</h2>
        <button className="add-transaction-btn" onClick={() => setIsModalOpen(true)}>
          + Add Transaction
        </button>
      </div>

      {/* Search & Filters Section */}
      <div className="filters">
        {/* Search Bar */}
        <div className="Tsearch-bar">
          <input
            type="text"
            placeholder="Search transaction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="Tsearch-icon" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85 1.06-1.06-3.85-3.85zM6.5 11a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
          </svg>
        </div>

        {/* Dropdowns for Sort and Category Filter */}
        <div className="dropdowns">
          {[
            {
              label: "Sort by",
              value: sortBy,
              options: ["Latest", "Oldest", "A to Z", "Z to A", "Highest", "Lowest"],
              setter: setSortBy
            },
            {
              label: "Category",
              value: category,
              options: ["All Transactions", "Entertainment", "Bills", "Groceries", "Dining Out", "Transportation", "Personal Care", "Education", "Lifestyle", "Shopping", "General"],
              setter: setCategory
            }
          ].map(({ label, value, options, setter }) => (
            <div className="dropdown" key={label}>
              <label>{label}</label>
              <select onChange={(e) => setter(e.target.value)} value={value}>
                {options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <table>
        <thead>
          <tr>
            <th>Recipient/Sender</th>
            <th>Category</th>
            <th>Transaction Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {displayedTransactions.length ? (
            displayedTransactions.map((t, i) => (
              <tr key={i}>
                <td>{t.name}</td>
                <td className="small-text">{t.category}</td>
                <td className="small-text">{formatDate(t.date)}</td>
                <td className={t.amount < 0 ? "debit" : "credit"}>
                  {t.amount < 0 ? `-${Math.abs(t.amount)}` : `+${t.amount}`}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "15px" }}>
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button className="arrow-button" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>←</button>
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} className={currentPage === i + 1 ? "active" : ""} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
        <button className="arrow-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>→</button>
      </div>

      {/* Modal for Adding Transactions */}
      <TransactionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTransaction} />
    </div>
  );
};

export default TransactionsPage;

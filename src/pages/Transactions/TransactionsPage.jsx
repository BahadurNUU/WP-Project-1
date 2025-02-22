import React, { useState, useEffect } from "react";
import { useFinanceData } from "../../context/FinanceContext";
import "./TransactionsPage.css";

const TransactionsPage = () => {
  const { data, loaded } = useFinanceData();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Transactions");
  const [sortBy, setSortBy] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    if (loaded && data?.transactions) {
      setTransactions(data.transactions);
      setFilteredTransactions(data.transactions);
    }
  }, [loaded, data]);

  useEffect(() => {
    let tempTransactions = [...transactions];

    if (searchTerm) {
      tempTransactions = tempTransactions.filter((transaction) =>
        transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== "All Transactions") {
      tempTransactions = tempTransactions.filter(
        (transaction) => transaction.category === category
      );
    }

    switch (sortBy) {
      case "Latest":
        tempTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "Oldest":
        tempTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "A to Z":
        tempTransactions.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z to A":
        tempTransactions.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "Highest":
        tempTransactions.sort((a, b) => b.amount - a.amount);
        break;
      case "Lowest":
        tempTransactions.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }

    setFilteredTransactions(tempTransactions);
    setCurrentPage(1);
  }, [transactions, searchTerm, category, sortBy]);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="transactions-container">
      <h2>Transactions</h2>

      {/* Search and Filters */}
      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search transaction"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="search-icon" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85 1.06-1.06-3.85-3.85zM6.5 11a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
          </svg>
        </div>
        <div className="dropdowns">
          <div className="dropdown">
            <label>Sort by</label>
            <select
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              value={sortBy}
            >
              <option value="Latest">Latest</option>
              <option value="Oldest">Oldest</option>
              <option value="A to Z">A to Z</option>
              <option value="Z to A">Z to A</option>
              <option value="Highest">Highest</option>
              <option value="Lowest">Lowest</option>
            </select>
          </div>
          <div className="dropdown">
            <label>Category</label>
            <select
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
              value={category}
            >
              <option value="All Transactions">All Transactions</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills">Bills</option>
              <option value="Groceries">Groceries</option>
              <option value="Dining Out">Dining Out</option>
              <option value="Transportation">Transportation</option>
              <option value="Personal Care">Personal Care</option>
              <option value="Education">Education</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Shopping">Shopping</option>
              <option value="General">General</option>
            </select>
          </div>
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
          {currentTransactions.length > 0 ? (
            currentTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.name}</td>
                <td className="small-text">{transaction.category}</td>
                <td className="small-text">{formatDate(transaction.date)}</td>
                <td className={transaction.amount < 0 ? "debit" : "credit"}>
                  {transaction.amount < 0 ? `-${Math.abs(transaction.amount)}` : `+${transaction.amount}`}
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

      {/* Pagination */}
      <div className="pagination">
        <button
          className="arrow-button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ←
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="arrow-button"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default TransactionsPage;

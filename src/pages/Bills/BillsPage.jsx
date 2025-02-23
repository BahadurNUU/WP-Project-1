import React, { useState, useEffect } from "react";
import "./Billspage.css";

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/data/data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch bills data");
        }
        return response.json();
      })
      .then((data) => {
        setBills(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading bills...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  const filteredBills = bills.filter((bill) =>
    bill.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBills = [...filteredBills].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="bills-page">
      <h2>Recurring Bills</h2>
      <div className="summary">
        <p>
          Total Bills: $
          {bills.reduce((acc, bill) => acc + (bill.amount || 0), 0).toFixed(2)}
        </p>
      </div>
      <div className="search-sort">
        <input
          type="text"
          placeholder="Search bills"
          aria-label="Search bills"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="latest">Latest</option>
          <option value="earliest">Earliest</option>
        </select>
      </div>
      <ul className="bills-list">
        {sortedBills.length > 0 ? (
          sortedBills.map((bill) => (
            <li key={bill.id} className="bill-item">
              <span className="bill-title">{bill.title || "Unknown Bill"}</span>
              <span className="bill-date">{bill.dueDate || "N/A"}</span>
              <span className={`bill-amount ${bill.dueSoon ? "due-soon" : ""}`}>
                ${bill.amount?.toFixed(2) || "0.00"}
              </span>
            </li>
          ))
        ) : (
          <p>No bills found.</p>
        )}
      </ul>
    </div>
  );
};

export default BillsPage;

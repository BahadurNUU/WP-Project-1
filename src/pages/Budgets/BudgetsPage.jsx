import React, { useState, useEffect } from "react";
import "./Billspage.css";

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/data/data.json")  //Correct way to access JSON in public/
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch bills data");
        }
        return response.json();
      })
      .then((data) => setBills(data))
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  const filteredBills = bills.filter((bill) =>
    bill.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBills = [...filteredBills].sort((a, b) => {
    return sortOrder === "latest"
      ? new Date(b.dueDate) - new Date(a.dueDate)
      : new Date(a.dueDate) - new Date(b.dueDate);
  });

  return (
    <div className="bills-page">
      <h2>Recurring Bills</h2>
      <div className="summary">
        <p>
          Total Bills: $
          {bills.reduce((acc, bill) => acc + bill.amount, 0).toFixed(2)}
        </p>
      </div>
      <div className="search-sort">
        <input
          type="text"
          placeholder="Search bills"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="latest">Latest</option>
          <option value="earliest">Earliest</option>
        </select>
      </div>
      <ul className="bills-list">
        {sortedBills.map((bill) => (
          <li key={bill.id} className="bill-item">
            <span className="bill-title">{bill.title}</span>
            <span className="bill-date">{bill.dueDate}</span>
            <span className={`bill-amount ${bill.dueSoon ? "due-soon" : ""}`}>
              ${bill.amount.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BillsPage;

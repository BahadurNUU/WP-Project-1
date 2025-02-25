import { useState, useEffect, useMemo } from "react";
import Card from "../../components/Card/Card";
import "./Billspage.css";
import { useFinanceData } from "../../context/FinanceContext";

export default function BillsPage() {
  const { data, loaded } = useFinanceData();
  const [bills, setBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 5; // Pagination limit


  useEffect(() => {
    if (data?.transactions) {
      const billTransactions = data.transactions
        .filter((t) => t.category === "Bills")
        .map((t) => {
          const dueDate = new Date(t.date);
          const today = new Date();
          const dueSoon = dueDate > today && dueDate <= new Date(today.setDate(today.getDate() + 7));
          return {
            title: t.name,
            dueDate: dueDate.toISOString().split("T")[0],
            amount: Math.abs(t.amount),
            dueSoon: dueSoon,
            paid: false,
          };
        });

      setBills(billTransactions);
    }
  }, [data]);


  const paidBillsTotal = useMemo(
    () => bills.filter((bill) => bill.paid).reduce((acc, bill) => acc + bill.amount, 0),
    [bills]
  );

  const upcomingBillsTotal = useMemo(
    () => bills.reduce((acc, bill) => acc + bill.amount, 0),
    [bills]
  );

  const dueSoonTotal = useMemo(
    () => bills.filter((bill) => bill.dueSoon).reduce((acc, bill) => acc + bill.amount, 0),
    [bills]
  );


  const filteredSortedBills = useMemo(() => {
    return [...bills]
      .filter((bill) =>
        bill.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === "latest") {
          return new Date(b.dueDate) - new Date(a.dueDate);
        } else if (sortOrder === "earliest") {
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortOrder === "name-asc") {
          return a.title.localeCompare(b.title);
        } else if (sortOrder === "name-desc") {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
  }, [bills, searchQuery, sortOrder]);


  const totalPages = Math.ceil(filteredSortedBills.length / billsPerPage);
  const displayedBills = filteredSortedBills.slice(
    (currentPage - 1) * billsPerPage,
    currentPage * billsPerPage
  );

  return (
    <div className="bills-page">
      <h2>Recurring Bills</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Search & Sorting Section */}
      <div className="search-sort">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search bills"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="search-icon" viewBox="0 0 20 20">
            <circle cx="8" cy="8" r="6" stroke="#007bff" strokeWidth="2" fill="none" />
            <line x1="12" y1="12" x2="18" y2="18" stroke="#007bff" strokeWidth="2" />
          </svg>
        </div>

        <div className="sort-bar">
          <label>Sort by:</label>
          <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
            <option value="latest">Latest</option>
            <option value="earliest">Earliest</option>
            <option value="name-asc">A to Z</option>
            <option value="name-desc">Z to A</option>
          </select>
        </div>
      </div>

      <div className="content-layout">

        <div className="bill-list-card">
          <Card title="Bills List">
            <table className="bills-table">
              <thead>
                <tr>
                  <th>Bill Title</th>
                  <th>Due Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {displayedBills.length > 0 ? (
                  displayedBills.map((bill, index) => (
                    <tr key={index} className={bill.dueSoon ? "due-soon" : ""}>
                      <td>{bill.title}</td>
                      <td>{bill.dueDate}</td>
                      <td className={bill.dueSoon ? "highlight" : ""}>
                        ${bill.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-bills">No bills found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>

          {/* Pagination */}
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ← Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next →
            </button>
          </div>
        </div>

        { }
        <div className="right-panel">
          <div className="total-bills-card">
            <Card title="Total Bills">
              <p className="total-amount">
                ${bills.reduce((acc, bill) => acc + (bill.amount || 0), 0).toFixed(2)}
              </p>
            </Card>
          </div>

          { }
          <div className="summary-section">
            <Card title="Summary">
              <div className="summary-details">
                <div className="summary-item">
                  <span className="label">Paid Bills:</span>
                  <span className="value">${paidBillsTotal.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Total Upcoming:</span>
                  <span className="value">${upcomingBillsTotal.toFixed(2)}</span>
                </div>
                <div className="summary-item due-soon">
                  <span className="label">Due Soon:</span>
                  <span className="value">${dueSoonTotal.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}

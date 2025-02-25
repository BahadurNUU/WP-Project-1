import { useState, useEffect, useMemo } from "react";
import Card from "../../components/Card/Card";
import "./Billspage.css";
import { useFinanceData } from "../../context/FinanceContext";

export default function BillsPage() {
  // Fetching financial data from context
  const { data, loaded } = useFinanceData();

  // State to store bills, search input, sorting order, error messages, and pagination
  const [bills, setBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 5;

  // useEffect to process and store bills when data changes
  useEffect(() => {
    if (data?.transactions) {
      const billTransactions = data.transactions
        .filter((t) => t.category === "Bills") // Filtering transactions categorized as "Bills"
        .map((t) => {
          const dueDate = new Date(t.date);
          const today = new Date();
          const dueSoon = dueDate < today && !t.recurring; // Marking overdue if not recurring
          const paid = t.paid;

          // Formatting due date as "Monthly - nth day"
          const day = dueDate.getDate();
          const suffix = ["st", "nd", "rd"][((day % 10) - 1) % 3] || "th";
          const formattedDueDate = `Monthly - ${day}${suffix}`;

          return {
            title: t.name,
            dueDate: formattedDueDate,
            amount: Math.abs(t.amount),
            dueSoon: dueSoon,
            paid: paid,
            recurring: t.recurring,
            dayValue: day, 
          };
        });

      setBills(billTransactions); // Updating state with processed bills
    }
  }, [data]);

  // Calculating total amount of paid bills
  const paidBillsTotal = useMemo(
    () => bills.filter((bill) => bill.paid).reduce((acc, bill) => acc + bill.amount, 0),
    [bills]
  );

  // Calculating total of upcoming (not overdue) unpaid bills
  const upcomingBillsTotal = useMemo(
    () => bills.filter((bill) => !bill.dueSoon && !bill.paid).reduce((acc, bill) => acc + bill.amount, 0),
    [bills]
  );

  // Calculating total of overdue bills
  const dueSoonTotal = useMemo(
    () => bills.filter((bill) => bill.dueSoon).reduce((acc, bill) => acc + bill.amount, 0),
    [bills]
  );

  // Filtering and sorting bills based on search and sort order
  const filteredSortedBills = useMemo(() => {
    return [...bills]
      .filter((bill) =>
        bill.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === "latest") {
          return b.dayValue - a.dayValue; // Sorting by latest due date
        } else if (sortOrder === "earliest") {
          return a.dayValue - b.dayValue; // Sorting by earliest due date
        } else if (sortOrder === "name-asc") {
          return a.title.localeCompare(b.title); // Sorting alphabetically (A-Z)
        } else if (sortOrder === "name-desc") {
          return b.title.localeCompare(a.title); // Sorting alphabetically (Z-A)
        }
        return 0;
      });
  }, [bills, searchQuery, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSortedBills.length / billsPerPage);
  const displayedBills = filteredSortedBills.slice(
    (currentPage - 1) * billsPerPage,
    currentPage * billsPerPage
  );

  return (
    <div className="bills-page">
      <h2>Recurring Bills</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="search-sort">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search bills"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                        {bill.paid ? " ✅" : bill.dueSoon ? " ❌" : ""}
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

          <div className="pagination">
            <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>← Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next →</button>
          </div>
        </div>

        <div className="right-panel">
          <div className="total-bills-card">
            <Card title="Total Bills">
              <p className="total-amount">${bills.reduce((acc, bill) => acc + (bill.amount || 0), 0).toFixed(2)}</p>
            </Card>
          </div>
          <div className="summary-section">
            <Card title="Summary">
              <div className="summary-details">
                <div className="summary-item"><span className="label">Paid Bills:</span><span className="value">${paidBillsTotal.toFixed(2)}</span></div>
                <div className="summary-item"><span className="label">Total Upcoming:</span><span className="value">${upcomingBillsTotal.toFixed(2)}</span></div>
                <div className="summary-item due-soon"><span className="label">Due Soon:</span><span className="value">${dueSoonTotal.toFixed(2)}</span></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

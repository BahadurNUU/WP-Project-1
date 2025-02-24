import { useState, useEffect, useMemo } from 'react';
import Card from '../../components/Card/Card';
import List from '../../components/List/List';
import Label from '../../components/Label/Label';
import "./Billspage.css";
import { useFinanceData } from '../../context/FinanceContext';

export default function BillsPage() {
  const { data } = useFinanceData();
  const [bills, setBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [error, setError] = useState(null);

  const filteredSortedBills = useMemo(() => {
    return [...bills]
      .filter((bill) =>
        bill.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === 'latest') {
          return new Date(b.dueDate) - new Date(a.dueDate);
        } else if (sortOrder === 'earliest') {
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortOrder === 'name-asc') {
          return a.title.localeCompare(b.title);
        } else if (sortOrder === 'name-desc') {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
  }, [bills, searchQuery, sortOrder]);

  return (
    <div className="bills-page">
      <h2>Recurring Bills</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="bills-container">
        <div className="bill-list-card">
          <div className="search-sort">
            <input
              type="text"
              className="search-input"
              placeholder="Search bills"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select className="sort-dropdown" onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
              <option value="latest">Sort by: Latest</option>
              <option value="earliest">Sort by: Earliest</option>
              <option value="name-asc">Sort by: A to Z</option>
              <option value="name-desc">Sort by: Z to A</option>
            </select>
          </div>
          <Card title="Bills List">
            <ul className="bills-list">
              <li className="bills-header">
                <span className="bill-title">Bill Title</span>
                <span className="bill-date">Due Date</span>
                <span className="bill-amount">Amount</span>
              </li>
              {filteredSortedBills.map((bill, index) => (
                <li key={index} className={`bill-item ${bill.dueSoon ? 'due-soon' : ''}`}>
                  <span className="bill-title">{bill.title}</span>
                  <span className="bill-date">{bill.dueDate}</span>
                  <Label
                    text={`$${(bill.amount || 0).toFixed(2)}`}
                    type={bill.dueSoon ? 'primary' : 'secondary'}
                  />
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="summary-card">
          <Card title="Total Bills" className="total-bills-card">
            <p className="total-amount">
              ${bills.reduce((acc, bill) => acc + (bill.amount || 0), 0).toFixed(2)}
            </p>
          </Card>
          <Card title="Summary" className="summary-details">
            <p><strong>Paid Bills:</strong> {bills.filter(b => b.paid).length} (${bills.filter(b => b.paid).reduce((acc, b) => acc + (b.amount || 0), 0).toFixed(2)})</p>
            <p><strong>Total Upcoming:</strong> {bills.filter(b => !b.paid).length} (${bills.filter(b => !b.paid).reduce((acc, b) => acc + (b.amount || 0), 0).toFixed(2)})</p>
            <p className="due-soon"><strong>Due Soon:</strong> {bills.filter(b => b.dueSoon).length} (${bills.filter(b => b.dueSoon).reduce((acc, b) => acc + (b.amount || 0), 0).toFixed(2)})</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
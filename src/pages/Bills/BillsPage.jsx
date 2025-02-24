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
      <div className="summary-card">
        <Card title="Total Bills">
          <p className="total-amount">
            ${bills.reduce((acc, bill) => acc + (bill.amount || 0), 0).toFixed(2)}
          </p>
        </Card>
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
          <option value="name-asc">A to Z</option>
          <option value="name-desc">Z to A</option>
        </select>
      </div>
      <Card title="Bills List">
        <List
          data={filteredSortedBills}
          render={(bill, index) => (
            <li key={index} className={`bill-item ${bill.dueSoon ? 'due-soon' : ''}`}>
              <span className="bill-title">{bill.title}</span>
              <span className="bill-date">{bill.dueDate}</span>
              <Label
                text={`$${(bill.amount || 0).toFixed(2)}`}
                type={bill.dueSoon ? 'primary' : 'secondary'}
              />
            </li>
          )}
        />
      </Card>
    </div>
  );
}

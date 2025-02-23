import { useEffect, useState } from "react";

import Transaction from "../../components/TransactionsFolder/Transaction";
import Data from "../../../public/data/data.json";

const TransactionsPage = () => {

  const [transactions, setTransactions] = useState(Data.transactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("Latest");
  const [selectedCategory, setSelectedCategory] = useState("All Transactions");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesCategory =
      selectedCategory === "All Transactions" ||
      transaction.category === selectedCategory;
    const matchesSearch = transaction.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sort logic
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortType === "Latest") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortType === "Oldest") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortType === "A to Z") {
      return a.name.localeCompare(b.name);
    } else if (sortType === "Z to A") {
      return b.name.localeCompare(a.name);
    } else if (sortType === "Highest") {
      return b.amount - a.amount;
    } else if (sortType === "Lowest") {
      return a.amount - b.amount;
    }
    return 0;
  });

  const transactionRows = sortedTransactions.map((transaction, index) => (
    <tr key={index}>
      <td className="recepient">
        <img src={transaction.avatar} alt="avatar" />
        <span>{transaction.name}</span>
      </td>
      <td className="category">{transaction.category}</td>
      <td className="date">
        {new Date(transaction.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>
      <td
        className="amount"
        style={{
          color: transaction.amount > 0 ? "hsl(177, 52%, 32%)" : "",
        }}
      >
        {transaction.amount > 0
          ? `+ $${Math.abs(transaction.amount).toFixed(2)}`
          : `- $${Math.abs(transaction.amount).toFixed(2)}`}
      </td>
    </tr>
  ));

  return (
    <div className="transaction-page">
      <h1>Transactions</h1>

      <div className="card">
        <div className="card-header">
          <div className="table-filters">
            <Transaction
              sortType={sortType}
              onSortChange={setSortType}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>

        <div className="card-body">
          <table>
            <thead>
              <tr>
                <th className="recepient">Recipient/Sender</th>
                <th className="category">Category</th>
                <th className="date">Transaction Date</th>
                <th className="amount">Amount</th>
              </tr>
            </thead>
            <tbody>{transactionRows}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;

import { useState } from "react";

const Transaction = ({ 
  sortType, 
  onSortChange, 
  selectedCategory, 
  onCategoryChange, 
  searchValue, 
  onSearchChange 
}) => {
  const [isSortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [isFilterDropdownVisible, setFilterDropdownVisible] = useState(false);

  return (
    <div className="unified-controls">
      {/* Sort Button */}
      <div className="filter-button">
        <label htmlFor="sort">Sort by</label>
        <button id="sort" onClick={() => setSortDropdownVisible(!isSortDropdownVisible)}>
          <div className="mobile-layout">
            <SortIcon />
          </div>
          <div className="desktop-layout">
            <span>{sortType}</span>
            <CaretDownIcon />
          </div>
        </button>
        {isSortDropdownVisible && (
          <div className="dropdown-menu">
            {["Oldest", "Latest", "A to Z", "Z to A", "Highest", "Lowest"].map((type) => (
              <a
                href="#"
                key={type}
                onClick={(e) => {
                  e.preventDefault();
                  onSortChange(type);
                  setSortDropdownVisible(false);
                }}
              >
                {type}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Filter Button */}
      <div className="filter-button">
        <label htmlFor="category">Category</label>
        <button id="category" onClick={() => setFilterDropdownVisible(!isFilterDropdownVisible)}>
          <div className="mobile-layout">
            <FilterIcon />
          </div>
          <div className="desktop-layout">
            <span>{selectedCategory}</span>
            <CaretDownIcon />
          </div>
        </button>
        {isFilterDropdownVisible && (
          <div className="dropdown-menu">
            {[
              "All Transactions",
              "Entertainment",
              "Bills",
              "Groceries",
              "Dining Out",
              "Transportation",
            ].map((category) => (
              <a
                href="#"
                key={category}
                onClick={(e) => {
                  e.preventDefault();
                  onCategoryChange(category);
                  setFilterDropdownVisible(false);
                }}
              >
                {category}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="search-icon">
          <SearchIcon />
        </div>
      </div>
    </div>
  );
};

// Inline Icons

const SortIcon = () => (
  <svg fill="none" height="15" viewBox="0 0 16 15" width="16" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.25 0H1.75A1.25 1.25 0 0 0 .5 1.75v12.5A1.25 1.25 0 0 0 1.75 15h12.5A1.25 1.25 0 0 0 15 14.25V1.75A1.25 1.25 0 0 0 14.25 0zM3.625 3.125h7.5a.625.625 0 1 1 0 1.25h-7.5a.625.625 0 1 1 0-1.25zm3.125 8.75H3.625a.625.625 0 1 1 0-1.25h3.125a.625.625 0 1 1 0 1.25zm.625-3.75H3.625a.625.625 0 1 1 0-1.25h3.75a.625.625 0 1 1 0 1.25zm6.067 2.317-1.875 1.875a.625.625 0 0 1-.885 0l-1.875-1.875a.625.625 0 1 1 .885-.885l.808.809V6.25a.625.625 0 1 1 1.25 0v3.492l.808-.809a.625.625 0 1 1 .885.885z" fill="#201f24"/>
  </svg>
);

const CaretDownIcon = () => (
  <svg fill="none" height="6" viewBox="0 0 12 6" width="12" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.354.854 6.354 5.854a.625.625 0 0 1-.885 0L.354.854A.625.625 0 0 1 1.25 0h9.5a.625.625 0 0 1 .604.854z" fill="#201f24"/>
  </svg>
);

const FilterIcon = () => (
  <svg fill="none" height="16" viewBox="0 0 18 16" width="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.798 2.716l-5.292 5.65v4.335a.875.875 0 0 1-.557.82l-2.5 1.667a.875.875 0 0 1-1.284-.751V8.665L1.884 3.016a1.25 1.25 0 0 1-.219-1.56c.204-.325.548-.546.937-.546h13.75c.39 0 .733.221.937.546a1.25 1.25 0 0 1-.219 1.56z" fill="#201f24"/>
  </svg>
);

const SearchIcon = () => (
  <svg fill="none" height="14" viewBox="0 0 14 14" width="14" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.354 13.146l-3.13-3.129A5.626 5.626 0 0 0 11.487 5.25 5.625 5.625 0 1 0 5.25 11.487a5.626 5.626 0 0 0 4.767-1.263l3.13 3.129a.625.625 0 0 0 .885-.885zM1.75 5.25a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" fill="#201f24"/>
  </svg>
);

export default Transaction;

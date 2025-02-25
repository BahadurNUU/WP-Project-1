import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "../components/Button/Button";
import Card from "../components/Card/Card";
import Modal from "../components/Modal/Modal";
import Sidebar from "../components/Sidebar/Sidebar";
import FinanceContext from "../context/FinanceContext";
import BudgetsPage from "../pages/Budgets/BudgetsPage";
import OverviewPage from "../pages/Overview/OverviewPage";
import PotsPage from "../pages/Pots/PotsPage";
import TransactionsPage from "../pages/Transactions/TransactionsPage";

// Button Component Test
describe("Button Component", () => {
  test("renders the button with correct text", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click Me");
  });

  test("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// Card Component Test
describe("Card Component", () => {
  test("renders Card component with children", () => {
    render(<Card>Test Card</Card>);
    expect(screen.getByText("Test Card")).toBeInTheDocument();
  });
});

// Modal Component Test
describe("Modal Component", () => {
  test("renders Modal component when open", () => {
    render(<Modal isOpen={true}>Modal Content</Modal>);
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });
});

// Sidebar Component Test
describe("Sidebar Component", () => {
  test("renders Sidebar component", () => {
    render(<Sidebar />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});

// FinanceContext Test
describe("FinanceContext", () => {
  test("provides default values", () => {
    render(
      <FinanceContext.Provider value={{ balance: 100 }}>
        <FinanceContext.Consumer>
          {(value) => <div>{value.balance}</div>}
        </FinanceContext.Consumer>
      </FinanceContext.Provider>
    );
    expect(screen.getByText("100")).toBeInTheDocument();
  });
});

// Page Tests
describe("Page Components", () => {
  test("renders BudgetsPage", () => {
    render(<BudgetsPage />);
    expect(screen.getByText(/Budget/i)).toBeInTheDocument();
  });

  test("renders OverviewPage", () => {
    render(<OverviewPage />);
    expect(screen.getByText(/Overview/i)).toBeInTheDocument();
  });

  test("renders PotsPage", () => {
    render(<PotsPage />);
    expect(screen.getByText(/Pots/i)).toBeInTheDocument();
  });

  test("renders TransactionsPage", () => {
    render(<TransactionsPage />);
    expect(screen.getByText(/Transactions/i)).toBeInTheDocument();
  });
});

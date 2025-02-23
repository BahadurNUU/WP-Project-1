import { useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import OverviewPage from './pages/Overview/OverviewPage'
import TransactionsPage from './pages/Transactions/TransactionsPage'
import BudgetsPage from './pages/Budgets/BudgetsPage'
import PotsPage from './pages/Pots/PotsPage'
import BillsPage from './pages/Bills/BillsPage'
import { useFinanceData } from './context/FinanceContext'
import './App.css'

function App() {
  const { loaded } = useFinanceData()
  const [page, setPage] = useState('overview')


  const content = {
    overview: <OverviewPage />,
    transactions: <TransactionsPage />,
    budgets: <BudgetsPage />,
    pots: <PotsPage />,
    bills: <BillsPage />
  }

  /** TODO:
   * Each tab panel needs to have aria-labelledby attribute
   * All of the tabpanel elements have tabindex="0" to make them tabbable
   * Each tab panel except the active one has the 'hidden' attribute
  */

  return (
    <div className='container'>
      <Sidebar onPageChange={setPage} />
      <main>
        {loaded ? (content[page]) : <h1>Loading...</h1>}
      </main>
    </div>
  )
}

export default App

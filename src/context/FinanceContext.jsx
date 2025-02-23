import { createContext, useEffect, useState, useContext } from "react"

export const FinanceContext = createContext({})

export function FinanceContextProvider({ children }) {
  const [data, setData] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const resp = await fetch('/data/data.json')
        const data = await resp.json()
        setData(data)
        setLoaded(true)
      } catch (error) {
        console.log('Fetch Error: ', error.message)
      }
    }

    fetchData()
  }, [])

  return (
    <FinanceContext.Provider value={{ data, loaded, setData }}> { children } </FinanceContext.Provider>
  )
}

export function useFinanceData() {
  return useContext(FinanceContext)
}
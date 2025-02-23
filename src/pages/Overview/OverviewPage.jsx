import Card from '../../components/Card/Card'
import { useFinanceData } from '../../context/FinanceContext'
import { PieChart, ResponsiveContainer, Pie, Tooltip, Legend, Cell } from 'recharts'
import './OverviewPage.css'

export default function OverviewPage() {
  const { data } = useFinanceData()
  
  return (
		<div
			id='overview'
			role='tabpanel'
			aria-labelledby='tab-1'
			tabIndex='0'
		>
			<h2 className='section-title'>Overview</h2>
			<div className='wrapper'>
				<Card
					id='balance'
					title='Current Balance'
					type='dark'
				>
					<p className='txt-size-xl'>
						<b>${data.balance.current}</b>
					</p>
				</Card>
				<Card
					id='income'
					title='Income'
				>
					<p className='txt-size-xl'>
						<b>${data.balance.income}</b>
					</p>
				</Card>
				<Card
					id='expenses'
					title='Expenses'
				>
					<p className='txt-size-xl'>
						<b>${data.balance.expenses}</b>
					</p>
				</Card>
				<Card
					id='pots'
					title='Pots'
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'stretch',
							gap: '2rem',
							flexWrap: 'wrap',
						}}
					>
						<div className='block'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='16'
								height='16'
								className='bi bi-piggy-bank-fill'
								viewBox='0 0 16 16'
							>
								<path d='M7.964 1.527c-2.977 0-5.571 1.704-6.32 4.125h-.55A1 1 0 0 0 .11 6.824l.254 1.46a1.5 1.5 0 0 0 1.478 1.243h.263c.3.513.688.978 1.145 1.382l-.729 2.477a.5.5 0 0 0 .48.641h2a.5.5 0 0 0 .471-.332l.482-1.351c.635.173 1.31.267 2.011.267.707 0 1.388-.095 2.028-.272l.543 1.372a.5.5 0 0 0 .465.316h2a.5.5 0 0 0 .478-.645l-.761-2.506C13.81 9.895 14.5 8.559 14.5 7.069q0-.218-.02-.431c.261-.11.508-.266.705-.444.315.306.815.306.815-.417 0 .223-.5.223-.461-.026a1 1 0 0 0 .09-.255.7.7 0 0 0-.202-.645.58.58 0 0 0-.707-.098.74.74 0 0 0-.375.562c-.024.243.082.48.32.654a2 2 0 0 1-.259.153c-.534-2.664-3.284-4.595-6.442-4.595m7.173 3.876a.6.6 0 0 1-.098.21l-.044-.025c-.146-.09-.157-.175-.152-.223a.24.24 0 0 1 .117-.173c.049-.027.08-.021.113.012a.2.2 0 0 1 .064.199m-8.999-.65a.5.5 0 1 1-.276-.96A7.6 7.6 0 0 1 7.964 3.5c.763 0 1.497.11 2.18.315a.5.5 0 1 1-.287.958A6.6 6.6 0 0 0 7.964 4.5c-.64 0-1.255.09-1.826.254ZM5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0' />
							</svg>
							<p>
								Total Saved:
								<b>
									$
									{data.pots.reduce((acc, pot) => {
										acc += pot.total;
										return acc;
									}, 0)}
								</b>
							</p>
						</div>
						<ul className='card-list'>
							{data.pots.map((pot) => {
								return (
									<li
										style={{ borderLeft: `4px solid ${pot.theme}` }}
										key={pot.id}
									>
										{pot.name}: <b>${pot.total}</b>
									</li>
								)
							})}
						</ul>
					</div>
				</Card>
				<Card
					id='budget'
					title='Budgets'
				>
					<div style={{ height: 300, width: '100%' }}>
						<ResponsiveContainer
							width='100%'
							height='100%'
						>
							<PieChart>
								<Pie
                  dataKey='maximum'
                  nameKey='category'
									startAngle={0}
									endAngle={360}
									data={data.budgets}
									cx='50%'
									cy='50%'
									outerRadius='50%'
                  fill='#2C3E50'
                  label
								>
									{data.budgets.map((budget, idx) => (
										<Cell
											key={idx}
											fill={budget.theme}
										/>
									))}
                </Pie>
                <Tooltip/>
								<Legend
									verticalAlign='top'
									height={36}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>
				</Card>
				<Card
					id='bills'
					title='Recurring Bills'
				>
          <p>Total Number of bills: <b>{data.transactions.reduce((count, obj) => {
            if (obj.category == 'Bills') {
              count += 1
              return count
            }
            return count
          }, 0)}</b></p>
				</Card>
				<Card
					id='transactions'
					title='Transactions'
				>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.slice(0, 5).map((transaction, idx) => {
                return (
                  <tr key={idx}>
                    <td>{transaction.name}</td>
                    <td>{transaction.category}</td>
                    <td>${transaction.amount}</td>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
				</Card>
			</div>
		</div>
	)
}
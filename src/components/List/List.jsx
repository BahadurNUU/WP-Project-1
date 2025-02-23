import './List.css'

export default function List({ data, render, title }) {
  
  const CardHeader = ({ title }) => (
    <div className='list-header'>
      <h4>{title}</h4>
    </div>
  )

  return (
    <div className='list-container'>
      { title && <CardHeader title={title}/>}
      <ul className="list">
        { data.map((item, index) => render(item, index)) }
      </ul>
    </div>
  )
}
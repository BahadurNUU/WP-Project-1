import './Button.css'

export default function Button({ children, type, ...props }) {
  return (
    <button {...props} className={`btn btn-${type}`}>{ children }</button>
  )
}
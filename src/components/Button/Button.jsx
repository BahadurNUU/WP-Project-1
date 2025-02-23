import './Button.css'

export default function Button({ children, type='primary', ...props }) {
  return (
    <button {...props} className={`btn btn-${type}`}>{ children }</button>
  )
}
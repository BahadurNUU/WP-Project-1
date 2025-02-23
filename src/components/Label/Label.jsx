import './Label.css'

export default function Label({ text, type = 'secondary' }) {
  return (
    <span className={`label label-${type}`}>{text}</span>
  )
}
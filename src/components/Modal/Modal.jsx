import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Button from "../Button/Button"
import './Modal.css'

export default function Modal({ open, title, width = 400, onClose, footerButtons, children, ...props }) {
  const modalRef = useRef(null)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (open) {
      modalRef.current.showModal()
    } else {
      modalRef.current.close()
    }
  }, [open])

  const closeModal = () => {
    setIsClosing(true)
		setTimeout(() => {
			onClose()
			setIsClosing(false)
		}, 400)
  }

  return createPortal(
    <dialog data-closing={isClosing} ref={modalRef} style={{width: width + 'px'}} {...props} className="modal">
      <div className="modal-header d-flex">
        <h3>{title}</h3>
        <Button
          aria-label="Close the modal"
          onClick={closeModal}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
          </svg>
        </Button>
      </div>
      <div className="modal-content">
        {children}
      </div>
      <div className="modal-footer">
        {footerButtons.map((btn, idx) => (
          <Button
            key={idx}
            style={btn.style}
            onClick={() => {
              btn.handler()
              closeModal()
            }}
          >
            {btn.text}
          </Button>
        ))}
      </div>
  </dialog>, document.getElementById('modal'))
}
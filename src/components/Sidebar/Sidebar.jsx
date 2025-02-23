import { useState } from 'react';
import logo from '../../assets/icons/react.svg'
import './Sidebar.css'

export default function Sidebar({ onPageChange }) {
  const [isExpanded, setIsExpanded] = useState(true)

  const changeTab = (tablist, tab) => {
    tablist
      .querySelectorAll('.nav-btn')
      .forEach(btn => {
        btn.setAttribute('aria-selected', false)
        btn.setAttribute('tabindex', '-1')
      });
    
    
    tab.setAttribute('aria-selected', true)
    tab.setAttribute('tabindex', '0')
    tab.focus()
    const tabPanelId = tab.getAttribute('aria-controls')
    onPageChange(tabPanelId)
  }

  const clickHandler = event => {
    const btn = event.target.closest('.nav-btn')
    if (!btn) return
    changeTab(event.currentTarget, btn)
  }

  const keyDownHandler = event => {
    const activeElem = document.activeElement
    const tablist = event.currentTarget
    const tabs = event.currentTarget.querySelectorAll('.nav-btn')
    
    switch (event.key) {
      case 'ArrowDown':
        const nextTab = activeElem.parentElement.nextElementSibling?.querySelector('.nav-btn')
        if (!nextTab) {
          changeTab(tablist, tabs[0])
          break
        }
        changeTab(tablist, nextTab)
        break
      case 'ArrowUp':
        const prevTab = activeElem.parentElement.previousElementSibling?.querySelector('.nav-btn')
        if (!prevTab) {
          changeTab(tablist, tabs[tabs.length - 1])
          break
        }
        changeTab(tablist, prevTab)
        break
      default:
        break
    }
  }

  const collapseSidebar = event => {
    const btn = event.target.closest('#collapse-btn')
    if (!btn) return
    setIsExpanded(prev => !prev)
  }

	return (
		<nav id='sidebar'>
			<a
				href=''
				className='logo'
			>
				<img
					src={logo}
					alt='Finance logo'
				/>
      </a>

      <button onClick={collapseSidebar} id='collapse-btn' aria-label='Collapse the sidebar' aria-expanded={isExpanded}>
        {isExpanded ? 
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-chevron-left" viewBox="0 0 16 16">
            <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
          </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                   </svg>}
      </button>
      
			<ul
				className='nav-list'
        role='tablist'
        aria-orientation='vertical'
        aria-label='App navigation'
        onClick={clickHandler}
        onKeyDown={keyDownHandler}
			>
				<li role='presentation'>
					<button id='tab-1' className='nav-btn' aria-controls='overview' role='tab' aria-selected="true" tabIndex="0" aria-describedby='focus-hint'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 48 48'
						>
							<path d='M39.5,43h-9c-1.381,0-2.5-1.119-2.5-2.5v-9c0-1.105-0.895-2-2-2h-4c-1.105,0-2,0.895-2,2v9c0,1.381-1.119,2.5-2.5,2.5h-9	C7.119,43,6,41.881,6,40.5V21.413c0-2.299,1.054-4.471,2.859-5.893L23.071,4.321c0.545-0.428,1.313-0.428,1.857,0L39.142,15.52	C40.947,16.942,42,19.113,42,21.411V40.5C42,41.881,40.881,43,39.5,43z'></path>
						</svg>
						<span>Overview</span>
					</button>
				</li>
				<li role='presentation'>
					<button id='tab-2' className='nav-btn' aria-controls='transactions' role='tab' aria-selected="false" tabIndex="-1">
            <svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 -960 960 960'
							fill='#e8eaed'
						>
							<path d='M282-160 120-322l162-162 42 42-90 90h286v60H234l90 90-42 42Zm328-132q-12 0-21-9t-9-21q0-13 9-21.5t21-8.5q13 0 21.5 8.5T640-322q0 12-8.5 21t-21.5 9Zm120 0q-12 0-21-9t-9-21q0-13 9-21.5t21-8.5q13 0 21.5 8.5T760-322q0 12-8.5 21t-21.5 9Zm-52-184-42-42 90-90H440v-60h286l-90-90 42-42 162 162-162 162ZM230-608q-12 0-21-9t-9-21q0-13 9-21.5t21-8.5q13 0 21.5 8.5T260-638q0 12-8.5 21t-21.5 9Zm120 0q-12 0-21-9t-9-21q0-13 9-21.5t21-8.5q13 0 21.5 8.5T380-638q0 12-8.5 21t-21.5 9Z' />
						</svg>
						<span>Transactions</span>
					</button>
				</li>
				<li role='presentation'>
					<button id='tab-2' className='nav-btn' aria-controls='budgets' role='tab' aria-selected="false" tabIndex="-1">
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='bi bi-pie-chart-fill'
							viewBox='0 0 16 16'
						>
							<path d='M15.985 8.5H8.207l-5.5 5.5a8 8 0 0 0 13.277-5.5zM2 13.292A8 8 0 0 1 7.5.015v7.778zM8.5.015V7.5h7.485A8 8 0 0 0 8.5.015' />
						</svg>
						<span>Budgets</span>
					</button>
				</li>
				<li role='presentation'>
					<button id='tab-4' className='nav-btn' aria-controls='pots' role='tab' aria-selected="false" tabIndex="-1">
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='bi bi-cash-coin'
							viewBox='0 0 16 16'
						>
							<path
								fillRule='evenodd'
								d='M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0'
							/>
							<path d='M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z' />
							<path d='M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083q.088-.517.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z' />
							<path d='M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 6 6 0 0 1 3.13-1.567' />
						</svg>
						<span>Pots</span>
					</button>
				</li>
				<li role='presentation'>
					<button id='tab-5' className='nav-btn' aria-controls='bills' role='tab' aria-selected="false" tabIndex="-1">
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='bi bi-receipt'
							viewBox='0 0 16 16'
						>
							<path d='M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z' />
							<path d='M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5' />
						</svg>
						<span>Recurring bills</span>
					</button>
				</li>
      </ul>
      <div id='focus-hint' hidden>Press tab to move to the tab content</div>
		</nav>
	)
}

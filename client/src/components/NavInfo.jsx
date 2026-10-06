import React from 'react'
import { NavLink } from 'react-router-dom'

// Fanned deck of three cards. The back cards are masked where the front card sits,
// so the icon works over the button's translucent background.
const FannedDeckIcon = () => (
  <svg viewBox="-1 -1 26 26" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
    <defs>
      <mask id="fanned-deck-mask">
        <rect x="-1" y="-1" width="26" height="26" fill="white" />
        <rect x="7.1" y="3.1" width="9.8" height="14.8" rx="2.2" fill="black" />
      </mask>
    </defs>
    <g mask="url(#fanned-deck-mask)">
      <rect x="8" y="4" width="8" height="13" rx="1.5" transform="rotate(-26 12 21)" />
      <rect x="8" y="4" width="8" height="13" rx="1.5" transform="rotate(26 12 21)" />
    </g>
    <rect x="8" y="4" width="8" height="13" rx="1.5" />
    <path d="M12 7.8 L13.5 10.5 L12 13.2 L10.5 10.5 Z" fill="currentColor" stroke="none" />
  </svg>
)

// Clicking while already on the Profile page: the route doesn't change, so scroll here
const scrollToDeckPicker = () => document.getElementById('deck')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

// Floating top-right shortcuts: deck picker (all users) and admin (admins only),
// or a login button when logged out
const NavInfo = (props) => {
  let routeLink = props.routeLink
  return (
    <>
      {props.token &&
        <div id="top-actions">
          <NavLink to="/profile#deck" id="deck-button" aria-label="Choose your deck" title="Choose your deck" onClick={scrollToDeckPicker}><div><FannedDeckIcon /></div></NavLink>
          {props.isAdmin && <NavLink to="/admin" id="admin-button" aria-label="Admin" title="Admin"><div><i className="fas fa-user-shield"></i></div></NavLink>}
        </div>
      }
      {!props.token && routeLink !== "/login" && <NavLink to="/login" id="login-button"><div><i className="fas fa-sign-in-alt"></i></div></NavLink>}
    </>
  )
}

export default NavInfo

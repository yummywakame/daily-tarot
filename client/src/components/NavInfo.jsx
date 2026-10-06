import React from 'react'
import { NavLink } from 'react-router-dom'

// Floating top-right shortcut to the admin section (admins only), or a login button when logged out
const NavInfo = (props) => {
  let routeLink = props.routeLink
  return (
    <>
      {props.token && props.isAdmin && <NavLink to="/admin" id="admin-button" aria-label="Admin" title="Admin"><div><i className="fas fa-user-shield"></i></div></NavLink>}
      {!props.token && routeLink !== "/login" && <NavLink to="/login" id="login-button"><div><i className="fas fa-sign-in-alt"></i></div></NavLink>}
    </>
  )
}

export default NavInfo

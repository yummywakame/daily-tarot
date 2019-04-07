import React from 'react'
import { NavLink } from 'react-router-dom'

const NavInfo = (props) => {
  let routeLink = props.routeLink
  console.log(routeLink)
  return (
    <>
      <NavLink to="/about" id="info-button"><div>i</div></NavLink>
      {!props.token && routeLink !== "/login" && <NavLink to="/login" id="login-button"><div><i className="fas fa-sign-in-alt"></i></div></NavLink> }
    </>
  )
}

export default NavInfo
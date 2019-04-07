import React from 'react'
import { bubble as Menu } from 'react-burger-menu'
import { NavLink } from 'react-router-dom'

const Nav = (props) => {

  return (
    <Menu
      push id={"sidebar"}
      pageWrapId={"page-wrap"}
      outerContainerId={"outer-container"}
      width={200} >

      <NavLink to="/today" className="bm-item" tabIndex="0" activeClassName="active"><i className="fas fa-sun"></i><span>Today's Tarot</span></NavLink>
      <NavLink to="#!" className="bm-item" tabIndex="1" activeClassName="active"><i className="far fa-question-circle"></i><span>Ask a Question</span></NavLink>
      <NavLink to="#!" className="bm-item" tabIndex="2" activeClassName="active"><i className="far fa-calendar-alt"></i><span>Past Dailies</span></NavLink>
      <NavLink to="#!" className="bm-item" tabIndex="3" activeClassName="active"><i className="far fa-calendar-check"></i><span>Past Questions</span></NavLink>
      <NavLink to="/profile" className="bm-item" tabIndex="4" activeClassName="active"><i className="fas fa-user-circle"></i><span>Profile</span></NavLink>
      <NavLink to="#!" className="bm-item" tabIndex="5" onClick={props.logout} activeClassName="active"><i className="fas fa-sign-out-alt"></i><span>Log out</span></NavLink>
    </Menu>
  )
}

export default Nav
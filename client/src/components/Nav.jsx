import React from 'react'
import { slide as Menu } from 'react-burger-menu'
import { NavLink } from 'react-router-dom'

class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false
    }
  }

  handleStateChange(state) {
    this.setState({ menuOpen: state.isOpen })
  }

  closeMenu() {
    this.setState({ menuOpen: false })
  }

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  navClass({ isActive }) {
    return isActive ? 'bm-item active' : 'bm-item'
  }

  render() {
    return (
      <Menu
        id={"sidebar"}
        width={200}
        isOpen={this.state.menuOpen}
        onStateChange={(state) => this.handleStateChange(state)}>

        <NavLink to="/today" onClick={() => this.closeMenu()} className={this.navClass} tabIndex="0"><i className="fas fa-sun"></i><span>Today's Tarot</span></NavLink>
        <NavLink to="/pastdailies" onClick={() => this.closeMenu()} className={this.navClass} tabIndex="2"><i className="far fa-calendar-alt"></i><span>Past Dailies</span></NavLink>
        <NavLink to="/profile" onClick={() => this.closeMenu()} className={this.navClass} tabIndex="4"><i className="fas fa-user-circle"></i><span>Profile</span></NavLink>
        <NavLink to="#!" onClick={this.props.logout} className={this.navClass} tabIndex="5"><i className="fas fa-sign-out-alt"></i><span>Log out</span></NavLink>
      </Menu>
    )
  }
}

export default Nav

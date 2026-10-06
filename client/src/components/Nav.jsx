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

  logout = (e) => {
    e.preventDefault()
    this.props.logout()
  }

  render() {
    return (
      <Menu
        id={"sidebar"}
        width={260}
        isOpen={this.state.menuOpen}
        onStateChange={(state) => this.handleStateChange(state)}>

        <NavLink to="/today" onClick={() => this.closeMenu()} tabIndex="0"><i className="fas fa-sun"></i><span>Today's Tarot</span></NavLink>
        <NavLink to="/pastdailies" onClick={() => this.closeMenu()} tabIndex="2"><i className="far fa-calendar-alt"></i><span>Past Dailies</span></NavLink>
        <NavLink to="/profile" onClick={() => this.closeMenu()} tabIndex="4"><i className="fas fa-user-circle"></i><span>Profile</span></NavLink>
        {this.props.isAdmin && <NavLink to="/admin" onClick={() => this.closeMenu()} tabIndex="4"><i className="fas fa-user-shield"></i><span>Admin</span></NavLink>}
        <a href="#!" onClick={this.logout} tabIndex="5"><i className="fas fa-sign-out-alt"></i><span>Log out</span></a>
      </Menu>
    )
  }
}

export default Nav

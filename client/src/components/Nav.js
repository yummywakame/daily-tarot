import React from 'react'
import { bubble as Menu } from 'react-burger-menu'
import { NavLink } from 'react-router-dom'

class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false
    }
  }

  // This keeps your state in sync with the opening/closing of the menu
  // via the default means, e.g. clicking the X, pressing the ESC key etc.
  handleStateChange(state) {
    this.setState({ menuOpen: state.isOpen })
  }

  // This can be used to close the menu, e.g. when a user clicks a menu item
  closeMenu() {
    this.setState({ menuOpen: false })
  }

  // This can be used to toggle the menu, e.g. when using a custom icon
  // Tip: You probably want to hide either/both default icons if using a custom icon
  // See https://github.com/negomi/react-burger-menu#custom-icons
  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  render() {
    return (
      <Menu
        push id={"sidebar"}
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
        width={200}
        isOpen={this.state.menuOpen}
        onStateChange={(state) => this.handleStateChange(state)}>

        <NavLink to="/today" onClick={() => this.closeMenu()} className="bm-item" tabIndex="0" activeClassName="active"><i className="fas fa-sun"></i><span>Today's Tarot</span></NavLink>
        {/* <NavLink to="#!" onClick={() => this.closeMenu()} className="bm-item" tabIndex="1" activeClassName="active"><i className="far fa-question-circle"></i><span>Ask a Question</span></NavLink> */}
        <NavLink to="/pastdailies" onClick={() => this.closeMenu()} className="bm-item" tabIndex="2" activeClassName="active"><i className="far fa-calendar-alt"></i><span>Past Dailies</span></NavLink>
        {/* <NavLink to="#!" onClick={() => this.closeMenu()} className="bm-item" tabIndex="3" activeClassName="active"><i className="far fa-calendar-check"></i><span>Past Questions</span></NavLink> */}
        <NavLink to="/profile" onClick={() => this.closeMenu()} className="bm-item" tabIndex="4" activeClassName="active"><i className="fas fa-user-circle"></i><span>Profile</span></NavLink>
        <NavLink to="#!" onClick={this.props.logout} className="bm-item" tabIndex="5" activeClassName="active"><i className="fas fa-sign-out-alt"></i><span>Log out</span></NavLink>
      </Menu>
    )
  }
}

export default Nav
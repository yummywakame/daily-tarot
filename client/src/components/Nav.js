import React, { Component } from 'react'
import { bubble as Menu } from 'react-burger-menu'

class Nav extends Component {

  render () {
    return (
      <Menu 
        push id={ "sidebar" }
        pageWrapId={ "page-wrap" } 
        outerContainerId={ "outer-container" }
        width={ 200 } >
        <a href="#!" className="bm-item" tabIndex="0"><i className="fas fa-sun"></i><span>Today's Tarot</span></a>
        <a href="#!" className="bm-item" tabIndex="1"><i className="far fa-question-circle"></i><span>Ask a Question</span></a>
        <a href="#!" className="bm-item" tabIndex="2"><i className="far fa-calendar-alt"></i><span>Past Dailies</span></a>
        <a href="#!" className="bm-item" tabIndex="3"><i className="far fa-calendar-check"></i><span>Past Questions</span></a>
      </Menu>
    )
  }
}

export default Nav
            

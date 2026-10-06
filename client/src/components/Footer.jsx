import React from 'react'
import { Link } from 'react-router-dom'

// App scrolls to the top on route changes; this covers clicking the link while already on /about
const scrollToTop = () => window.scrollTo(0, 0)

const Footer = () => (
  <footer id="site-footer">
    <p>
      Web App Design by <a href="https://yummy-wakame.com">Yummy&nbsp;Wakame</a>
      <span className="footer-sep" aria-hidden="true">|</span>
      <Link to="/about" onClick={scrollToTop}>About&nbsp;&amp;&nbsp;Credits</Link>
    </p>
  </footer>
)

export default Footer

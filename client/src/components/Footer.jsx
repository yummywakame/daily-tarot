import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => (
  <footer id="site-footer">
    <p>Web App Design by <a href="https://yummy-wakame.com">Yummy Wakame</a></p>
    <p><Link to="/about">About &amp; Credits</Link></p>
  </footer>
)

export default Footer

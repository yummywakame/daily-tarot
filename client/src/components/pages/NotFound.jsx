import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => (
    <main id="page-wrap">
        <h2>The Page You Are Looking For Does Not Exist</h2>
        <p>Would you like to see your <Link to="/today" className="blue text-link">tarot card for today</Link>?</p>
    </main>
)

export default NotFound

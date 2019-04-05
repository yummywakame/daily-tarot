import React from 'react'

const Home = (props) => {
    return(
        <main id="page-wrap">
            <p>Welcome home {props.username}</p>
            <button onClick={props.logout}>Log Out</button>
        </main>
    )
}

export default Home
import React from 'react'

const Home = (props) => {
    return(
        <div>
            <p>Welcome home {props.username}</p>
            <button onClick={props.logout}>Log Out</button>
        </div>
    )
}

export default Home
import React from 'react'

const About = () => {

  return (
    <main id="page-wrap">
                <h2>About Daily Tarot</h2>
                
                <div className="card" id="about">
                    <h2>Why this app?</h2>
                    <p><i>This was my final project as a student for the Full-Stack MERN course (Feb 2019 Cohort) at <a href="https://vschool.io">V School</a>, taught by <a href="https://coursework.vschool.io/author/nate-jensen/">Nate Jensen</a>.</i></p>
                    <p>We were required to create a JavaScript app in React in one week that includes: </p>
                    <ul>
                        <li>Full back-end and front-end servers</li>
                        <li>Token-based user authentication</li>
                        <li>Custom MongoDB Database using Mongoose</li>
                        <li>Custom JSON API created from scratch</li>
                        <li>The ability to read, add, edit and delete database records</li>
                        <li>Components that use Protected Routes</li>
                        <li>Utilize Props, Providers and Consumers</li>
                    </ul>
                    
                    <h2>Author</h2>
                    <h4>OLIVIA MEIRING</h4>
                    <p className="center-stuff">
                        Website: <a href="https://yummy-wakame.com">yummy-wakame.com</a><br />
                        GitHub: <a href="https://github.com/yummywakame">github.com/yummywakame</a>
                    </p>  
                    
                    <h2>Credits</h2>
                    <p>All card images from the most beautiful tarot deck in the world ~ <a href="https://amzn.to/2G6kELm">The Universal Fantasy Tarot Deck</a>. The images were sourced <a href="http://www.marytcusack.com/maryc/tarot/UniversalFantasy.html">here</a>.</p>
                    <p>The deck is based on the high fantasy novel genre and the imagined literary setting fathered by J.R.R. Tolkien whose Middle-Earth is a blend of magic and the Middle Ages, and is inhabited by dragons, undead, demons, elves, dwarves, wizards, and heroes. This deck pictures all of these plus more mythical creatures: giant rodents, centaurs, satyrs, giant lammergeiers, water sprites, enormous flying snails, etc.</p>
                    <p>All tarot card descriptions are from <a href="https://www.biddytarot.com">Biddy Tarot</a> ~ by far the best and most accurate descriptions I have found on the web.</p>
                    <p>Burger menu created with the help of <a href="https://github.com/negomi/react-burger-menu">React Burger Menu</a></p>
                    
                </div>
            </main>
  )
}

export default About
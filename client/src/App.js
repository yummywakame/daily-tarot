import React from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { withUser } from './context/UserProvider.js'
import AuthContainer from './components/auth/AuthContainer.js'
import ProtectedRoute from './shared/ProtectedRoute.js'
import Home from './components/Home.js'
import NotFound from './components/NotFound.js'
import Nav from './components/Nav.js'

const App = (props) => {
  const { user, token } = props
  
  // document.title = "Daily Tarot ~ " + props.location.pathname.slice(1)[0].toUpperCase() + props.location.pathname.slice(2)
  
  return (
    <div id="outer-container">

      {token && <Nav />}
      <header><h1>Daily Tarot</h1></header>
      <main id="page-wrap">
        <Switch>

          <Route exact path="/" render={routerProps => token
            ?
            <Redirect to="/home" />
            :
            <AuthContainer {...routerProps} />}
          />


          {/* Protected Routes */}
          <ProtectedRoute
            token={token}
            path={"/home"}
            redirectTo={"/"}
            component={Home}
            username={user.username}
          />
          
          <Route path="*" component={ NotFound } />

        </Switch>
      </main>
    </div>
  )
}

export default withRouter(withUser(App))

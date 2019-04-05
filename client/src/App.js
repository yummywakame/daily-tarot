import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { withUser } from './context/UserProvider.js'
import AuthContainer from './components/auth/AuthContainer.js'
import ProtectedRoute from './shared/ProtectedRoute.js'
import Home from './components/Home.js'
import Nav from './components/Nav.js'

const App = (props) => {
  const { user, token } = props
  return (
    <div id="outer-container">

      {token && <Nav />}
      <header><h1>Daily Tarot</h1></header>
      
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

        </Switch>

    </div>
  )
}

export default withUser(App)

import React from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { withUser } from './context/UserProvider.js'
import AuthContainer from './components/auth/AuthContainer.js'
import ProtectedRoute from './shared/ProtectedRoute.js'
import Today from './components/pages/Today.js'
import NotFound from './components/NotFound.js'
import Nav from './components/Nav.js'

const App = (props) => {
  const { user, token, logout } = props
  
  document.title = "Daily Tarot ~ " + (props.location.pathname === "/" ? "" : props.location.pathname.slice(1)[0].toUpperCase() + props.location.pathname.slice(2))
  
  return (
    <div id="outer-container">

      {token && <Nav logout={logout} />}
      <header><h1>Daily Tarot</h1></header>
      
        <Switch>
        
          <Route exact path="/" render={() => token ? <Redirect to="/today"/> : <Redirect to="/login"/> } />

          <Route path="/login" render={routerProps => token
            ?
            <Redirect to="/today" />
            :
            <AuthContainer {...routerProps} />}
          />

          {/* Protected Routes */}
          <ProtectedRoute
            token={token}
            path={"/today"}
            redirectTo={"/login"}
            component={ Today }
            username={user.username}
          />
          
          <Route path="*" component={ NotFound } />

        </Switch>

    </div>
  )
}

export default withRouter(withUser(App))

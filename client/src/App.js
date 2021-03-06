import React from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { withUser } from './context/UserProvider.js'
import AuthContainer from './components/auth/AuthContainer.js'
import ProtectedRoute from './shared/ProtectedRoute.js'
import Today from './components/pages/Today.js'
import PastDailies from './components/pages/PastDailies.js'
import Profile from './components/pages/Profile.js'
import About from './components/pages/About.js'
import NotFound from './components/pages/NotFound.js'
import Nav from './components/Nav.js'
import NavInfo from './components/NavInfo.js'
import ErrorBoundary from './shared/ErrorBoundary.js'

const App = (props) => {
  const { user, token, logout } = props

  document.title = "Daily Tarot ~ " + (props.location.pathname === "/" ? "" : props.location.pathname.slice(1)[0].toUpperCase() + props.location.pathname.slice(2))

  return (
    <div id="outer-container">

      <NavInfo token={token} routeLink={props.location.pathname} />

      {token && <Nav logout={logout} />}
      <header><h1>Daily Tarot</h1></header>

      <Switch>

        <Route exact path="/" render={() =>
          token ? <Redirect to="/today" /> : <Redirect to="/login" /> 
        } />

        <Route path="/login" render={routerProps =>
           token ? <Redirect to="/today" /> : <AuthContainer {...routerProps} /> 
        } />

        {/* Protected Routes */}
        <ProtectedRoute token={token} path={"/today"} redirectTo={"/login"} component={Today} allowRev={user.allowRev} />

        <ProtectedRoute token={token} path={"/pastdailies"} redirectTo={"/login"} component={PastDailies} allowRev={user.allowRev} />

        <ProtectedRoute token={token} path={"/profile"} redirectTo={"/login"} component={Profile} user={user} />

        <Route path={"/about"} render={() => <ErrorBoundary><About /></ErrorBoundary>} />

        <Route path="*" component={NotFound} />

      </Switch>

    </div>
  )
}

export default withRouter(withUser(App))

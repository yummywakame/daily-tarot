import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
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
  const location = useLocation()

  const pageName = location.pathname === '/'
    ? ''
    : location.pathname.slice(1)[0].toUpperCase() + location.pathname.slice(2)
  document.title = `Daily Tarot ~ ${pageName}`

  return (
    <div id="outer-container">

      <NavInfo token={token} routeLink={location.pathname} />

      {token && <Nav logout={logout} />}
      <header><h1>Daily Tarot</h1></header>

      <Routes>

        <Route path="/" element={token ? <Navigate to="/today" /> : <Navigate to="/login" />} />

        <Route path="/login" element={token ? <Navigate to="/today" /> : <AuthContainer />} />

        <Route path="/today" element={
          <ProtectedRoute token={token} redirectTo="/login">
            <ErrorBoundary><Today allowRev={user.allowRev} /></ErrorBoundary>
          </ProtectedRoute>
        } />

        <Route path="/pastdailies" element={
          <ProtectedRoute token={token} redirectTo="/login">
            <ErrorBoundary><PastDailies allowRev={user.allowRev} /></ErrorBoundary>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute token={token} redirectTo="/login">
            <ErrorBoundary><Profile user={user} /></ErrorBoundary>
          </ProtectedRoute>
        } />

        <Route path="/about" element={<ErrorBoundary><About /></ErrorBoundary>} />

        <Route path="*" element={<NotFound />} />

      </Routes>

    </div>
  )
}

export default withUser(App)

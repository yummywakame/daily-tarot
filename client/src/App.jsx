import React from 'react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { withUser } from './context/UserProvider.jsx'
import AuthContainer from './components/auth/AuthContainer.jsx'
import ProtectedRoute from './shared/ProtectedRoute.jsx'
import Today from './components/pages/Today.jsx'
import PastDailies from './components/pages/PastDailies.jsx'
import Profile from './components/pages/Profile.jsx'
import About from './components/pages/About.jsx'
import Admin from './components/pages/Admin.jsx'
import NotFound from './components/pages/NotFound.jsx'
import Nav from './components/Nav.jsx'
import NavInfo from './components/NavInfo.jsx'
import ErrorBoundary from './shared/ErrorBoundary.jsx'

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

      {token && <Nav logout={logout} isAdmin={user.isAdmin === true} />}
      <header><h1><Link to="/today">Daily Tarot</Link></h1></header>

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

        {/* The client-side check only hides the page; every admin API call is enforced server-side */}
        <Route path="/admin" element={
          <ProtectedRoute token={token && user.isAdmin === true} redirectTo={token ? "/today" : "/login"}>
            <ErrorBoundary><Admin user={user} /></ErrorBoundary>
          </ProtectedRoute>
        } />

        <Route path="/about" element={<ErrorBoundary><About /></ErrorBoundary>} />

        <Route path="*" element={<NotFound />} />

      </Routes>

    </div>
  )
}

export default withUser(App)

import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary.js'

const ProtectedRoute = (props) => {
    const { token, path, redirectTo, component: Component, ...rest } = props
    return (
        token
            ?
            <Route path={path} render={routerProps =>
                <ErrorBoundary>
                    <Component {...routerProps} {...rest} />
                </ErrorBoundary>
            } />
            :
            <Redirect to={redirectTo} />
    )
}

export default ProtectedRoute
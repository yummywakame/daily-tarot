import React, { Component } from 'react'
import { useLocation } from 'react-router-dom'

class ErrorBoundaryInner extends Component {
    constructor() {
        super()
        this.state = {
            error: null,
            errorInfo: null
        }
    }

    componentDidCatch(error, info) {
        this.setState({ error, errorInfo: info })
    }

    render() {
        if (this.state.errorInfo) {
            return (
                <main id="page-wrap" className="error-boundary">
                    <h2>Something Went Wrong</h2>

                    <div className="card" id="about">
                        <details style={{ whiteSpace: 'pre-wrap' }}>
                            {this.state.error && this.state.error.toString()}
                            {this.state.errorInfo.componentStack}
                        </details>
                    </div>
                </main>
            )
        }
        return this.props.children
    }
}

// Wrap the class component so it resets automatically on route change
const ErrorBoundary = ({ children }) => {
    const location = useLocation()
    return <ErrorBoundaryInner key={location.pathname}>{children}</ErrorBoundaryInner>
}

export default ErrorBoundary

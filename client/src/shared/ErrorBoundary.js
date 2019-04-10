import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class ErrorBoundary extends Component {
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

    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.setState({
                error: null,
                errorInfo: null
            })
        }
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

export default withRouter(ErrorBoundary)
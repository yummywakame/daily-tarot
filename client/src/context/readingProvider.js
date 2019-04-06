import React, { Component } from 'react'
import axios from 'axios'
const readingAxios = axios.create()

// On every request, use the following middleware function
readingAxios.interceptors.request.use((config) => {
    const token = localStorage.token
    config.headers.Authorization = `Bearer ${token}`
    return config // return header with user and token for Auth
})

const ReadingContext = React.createContext()

class ReadingProvider extends Component {
    constructor() {
        super()
        this.state = {
            readings: []
        }
    }

    createReading = (newReading) => {
        readingAxios.post("/api/readings", newReading).then(res => {
            console.log(res)
        }).catch(err => console.log(err))
    }

    render() {
        return (
            <ReadingContext.Provider
                value={{
                    ...this.state,
                    createReading: this.createReading
                }}>
                {this.props.children}
            </ReadingContext.Provider>
        )
    }

}

export default ReadingProvider

export const withReading = C => props => (
    <ReadingContext.Consumer>
        {value => <C {...props} {...value} />}
    </ReadingContext.Consumer>
)
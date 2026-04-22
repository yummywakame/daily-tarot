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
            readings: [],
            pastReadings: [],
            readingMsg: "",
            PastReadingMsg: ""
        }
    }

    getAllUsersReadings = (_id) => {
        readingAxios.get(`/api/readings/user/${_id}`).then(res => {
            this.setState({ pastReadings: res.data.reverse() })
        }).catch(err => console.log(err))
    }

    deleteAllUsersReadings = (_id) => {
        readingAxios.delete(`/api/readings/user/${_id}`).then(res => {
            this.setState({
                pastReadings: [],
                PastReadingMsg: "Successfully deleted all past readings."
            })
        }).catch(err => console.log(err))
    }

    createReading = (newReading) => {
        readingAxios.post("/api/readings", newReading).then(res => {
            this.setState({ readings: res.data })
        }).catch(err => console.log(err))
    }

    updateReading = (_id, updates) => {
        readingAxios.put(`/api/readings/${_id}`, updates).then(res => {
            this.setState({
                readings: res.data,
                readingMsg: "Updated successfully!"
            })
        }).catch(err => console.log(err))
    }

    clearReadingMessages = () => {
        // Clear away messages
        this.setState({
            readingMsg: ""
        })
    }

    clearReadings = () => {
        // Clear all readings from state/props
        this.setState({
            readings: [],
            pastReadings: [],
            readingMsg: "",
        })
    }

    render() {
        return (
            <ReadingContext.Provider
                value={{
                    ...this.state,
                    createReading: this.createReading,
                    updateReading: this.updateReading,
                    getAllUsersReadings: this.getAllUsersReadings,
                    clearReadingMessages: this.clearReadingMessages,
                    deleteAllUsersReadings: this.deleteAllUsersReadings,
                    clearReadings: this.clearReadings
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
import React, { Component } from 'react'
import cardAxios from '../authAxios.js'

const CardContext = React.createContext()

class CardProvider extends Component {
    constructor() {
        super()
        this.state = {
            cards: []
        }
    }

    clearCardState = () => {
        this.setState({
            cards: []
        })
    }

    getRandomCard = () => {
        cardAxios.get("api/cards/random/1/77").then(res => {
            this.setState({ cards: res.data })
        }).catch(err => console.log(err))
    }

    render() {
        return (
            <CardContext.Provider
                value={{
                    ...this.state,
                    getRandomCard: this.getRandomCard,
                    clearCardState: this.clearCardState
                }}>
                {this.props.children}
            </CardContext.Provider>
        )
    }

}

export default CardProvider

export const withCard = C => props => (
    <CardContext.Consumer>
        {value => <C {...props} {...value} />}
    </CardContext.Consumer>
)
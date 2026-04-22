import React from 'react'
import { useNavigate } from 'react-router-dom'

const withNavigate = (C) => (props) => {
    const navigate = useNavigate()
    return <C {...props} navigate={navigate} />
}

export default withNavigate

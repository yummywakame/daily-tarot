import axios from 'axios'

// Shared axios instance for all authenticated API calls.
const authAxios = axios.create()

authAxios.interceptors.request.use((config) => {
    const token = localStorage.token
    config.headers.Authorization = `Bearer ${token}`
    return config
})

// A 401 here means the stored token is missing/expired/invalid server-side.
// Clear it and send the user back to login instead of leaving the app
// rendering blank/undefined data from empty provider state.
authAxios.interceptors.response.use(
    (response) => {
        // An HTML page instead of JSON means the request hit the SPA fallback,
        // e.g. a backend that hasn't been restarted since new routes were added.
        if (String(response.headers['content-type']).includes('text/html')) {
            return Promise.reject({ response: { status: response.status, data: { errMsg: 'Unexpected response from the server. It may need restarting.' } } })
        }
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
            window.location.href = `${base}/login`
        }
        return Promise.reject(error)
    }
)

export default authAxios

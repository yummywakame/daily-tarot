import axios from 'axios'

const raw = import.meta.env.BASE_URL || '/'
const apiBase = raw.replace(/\/$/, '')
if (apiBase) {
  axios.defaults.baseURL = apiBase
}

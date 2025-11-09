import axios from 'axios'

function getBaseRestUrl() {
  const urlParams = new URLSearchParams(window.location.search)
  const rest = urlParams.get('rest')
  if (rest) return rest
  const loc = window.location
  return `${loc.protocol}//${loc.host}/app/rest`
}

export const api = axios.create({
  baseURL: getBaseRestUrl(),
})

export function fetchStat() {
  return api.get('stat.cgi')
}


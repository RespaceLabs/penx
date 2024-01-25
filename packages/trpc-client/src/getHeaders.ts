export function getHeaders() {
  const token = localStorage.getItem('PENX_TOKEN')
  return {
    Authorization: !token ? '' : JSON.parse(token),
  }
}

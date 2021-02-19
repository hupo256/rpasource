import { request } from '@meizhilab/generalui'
export function getUserClients() {
  return request(`usam/client/user`, { method: 'GET' })
}
export function activateGobblerService(params) {
  return request(`rpasource/gobbler/activate`, { method: 'POST', data: { ...params } })
}

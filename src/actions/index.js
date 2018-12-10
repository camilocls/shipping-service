import { LOGIN, LOGOUT, CREATE_SERVICE } from '../constants/action-types'

export const login = token => ({ type: LOGIN, payload: token })
export const logout = () => ({ type: LOGOUT, payload: null })
export const createService = service => ({
  type: CREATE_SERVICE,
  payload: service,
})

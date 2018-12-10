import { LOGIN, LOGOUT, CREATE_SERVICE } from '../constants/action-types'

const initialState = {
  isAuth: null,
  services: [],
}

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, isAuth: action.payload }
    case LOGOUT:
      return { ...state, isAuth: action.payload, services: [] }
    case CREATE_SERVICE:
      return { ...state, services: [...state.services, action.payload] }
    default:
      return state
  }
}

export default rootReducer

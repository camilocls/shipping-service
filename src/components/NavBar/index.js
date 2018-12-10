import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { NavLink, withRouter } from 'react-router-dom'
import { logout as dispatchLogout } from '@/actions/index'
import './style.scss'

const ConnectedNavBar = props => {
  const { isAuth, logout, history } = props
  const { pathname } = history.location
  return (
    <nav className="nav-bar">
      <ul className="nav-bar__list">
        <li className="nav-bar__item">
          <NavLink className="nav-bar__link" exact to="/">
            Home
          </NavLink>
        </li>
        {!isAuth && pathname !== '/login' && (
          <li className="nav-bar__item">
            <NavLink className="nav-bar__link" to="/login">
              Login
            </NavLink>
          </li>
        )}
        {isAuth && pathname !== '/service' && (
          <li className="nav-bar__item">
            <NavLink className="nav-bar__link" to="/service">
              Create service
            </NavLink>
          </li>
        )}
        {isAuth && (
          <li className="nav-bar__item">
            <button
              type="button"
              className="nav-bar__link nav-bar-logout"
              onClick={logout}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}

ConnectedNavBar.propTypes = {
  isAuth: PropTypes.string,
  logout: PropTypes.func,
  history: PropTypes.object,
}

const mapStateToProps = state => ({ isAuth: state.isAuth })
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(dispatchLogout()),
})

const Navbar = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectedNavBar)

export default withRouter(Navbar)

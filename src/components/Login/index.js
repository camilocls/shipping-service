import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios'
import { login } from '@/actions/index'
import { Logo, NavBar } from '@/components'
import { API_URL } from '@/config/config'
import './style.scss'

function Loading() {
  return <div className="view-login__loading">Loading</div>
}

class ConnectedLogin extends Component {
  constructor() {
    super()

    this.state = {
      email: null,
      password: null,
      loading: false,
    }

    this.handleLogin = this.handleLogin.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleLogin(event) {
    event.preventDefault()
    const { email, password } = this.state
    const { dispatchLogin, history } = this.props
    this.setState({ loading: true })

    axios
      .post(`${API_URL}/login`, {
        email,
        password,
      })
      .then(response => {
        const { token } = response.data
        this.setState({ loading: false })
        dispatchLogin(token)
        history.push('/')
      })
      .catch(() => {
        // TODO: Handle error
      })
  }

  handleChange(event) {
    const { value, name } = event.target

    this.setState({
      [name]: value,
    })
  }

  render() {
    const { loading } = this.state

    return (
      <div className="container view view-login">
        <Logo />
        <NavBar />
        <div className="view-body">
          <h2 className="view__title">Login</h2>

          <form className="view-login__form" onSubmit={this.handleLogin}>
            <label className="view-login__label">
              <input
                className="view-login__input"
                name="email"
                type="email"
                required
                onChange={this.handleChange}
              />
            </label>
            <label className="view-login__label">
              <input
                className="view-login__input"
                name="password"
                type="password"
                required
                onChange={this.handleChange}
              />
            </label>
            {loading ? (
              <Loading />
            ) : (
              <button className="view-login__button" type="submit">
                Login
              </button>
            )}
          </form>
          <div className="view-login__note">
            Add any valid email and any password.
          </div>
        </div>
      </div>
    )
  }
}

ConnectedLogin.propTypes = {
  dispatchLogin: PropTypes.func,
  history: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
  dispatchLogin: token => dispatch(login(token)),
})

const Login = connect(
  null,
  mapDispatchToProps,
)(ConnectedLogin)

export default Login

import React, { Component } from 'react'
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader'
import { Home, Login, Service } from './components'

/**
 * Main Component with routes
 *
 * @class App
 * @extends {Component}
 */
class ConnectedApp extends Component {
  state = {}

  render() {
    const { isAuth } = this.props

    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              path="/login"
              render={props =>
                !isAuth ? <Login {...props} /> : <Redirect to="/" />
              }
            />
            <Route
              path="/service"
              render={props =>
                isAuth ? <Service {...props} /> : <Redirect to="/login" />
              }
            />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

ConnectedApp.propTypes = {
  isAuth: PropTypes.any,
}

const mapStateToProps = state => ({ isAuth: state.isAuth })

const App = connect(
  mapStateToProps,
  null,
)(ConnectedApp)

export default hot(module)(App)

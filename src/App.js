import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { Home } from './components';

/**
 * Main Component with routes
 *
 * @class App
 * @extends {Component}
 */
class App extends Component {
  render() {
    return(
      <Router>
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    )
  }
};

export default hot(module)(App)

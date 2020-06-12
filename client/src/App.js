import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeObject from './util/theme';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';

// Components
import Navbar from './components/layout/navbar.component';

// Pages
import Home from './pages/home.component';
import Register from './pages/register.component';
import Login from './pages/login.component';
import User from './pages/user.component';

const theme = createMuiTheme(themeObject);

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Navbar/>
          <div className="container">
            <Switch>

              <Route path="/" exact component={Home} />
              <Route path="/register" exact component={Register} />
              <Route path="/login" exact component={Login} />
              <Route path="/users/:userId" exact component={User} />
              <Route path="/users/:userId/posts/:postId" exact component={User} />

            </Switch>
          </div>
        </Router>
      </Provider>

    </MuiThemeProvider>

  );
}

export default App;

import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Home from './components/pages/home';
import Navbar from './components/Navbar/navbar';
import Register from './components/pages/register';
import MemeGenerator  from './components/pages/create';
import Upload from './components/pages/upload';
import Login from './components/pages/login';
import Logout from './components/pages/logout'

function App() {
  return (
    <>
      <Router>
        <div className="App">
          <Navbar />
        </div>
        <div className='container'>
          <Switch>
            <Route path='/'exact component={Home} />
            <Route path='/register' component={Register} />
            <Route path='/create' component={MemeGenerator } />
            <Route path='/upload' component={Upload} />
            <Route path='/login' component={Login} />
            <Route path='/logout' component={Logout} />
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;

import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Home from './components/pages/home';
import Navbar from './components/Navbar/navbar';
import Admin from './components/pages/admin';
import Create from './components/pages/create';
import Deleate from './components/pages/deleat';
import Login from './components/pages/login';
import Logout from './components/pages/logout';





function App() {
  return (
    <>
      <Router>
        <div className="App">
          <Navbar />
        </div>
        <div className='container'>
          <Switch>
            <Route path='/'component={Home} />
            <Route path='/Admin' exact component={Admin} />
            <Route path='/Create' component={Create} />
            <Route path='/Deleate' component={Deleate} />
            <Route path='/Login' component={Login} />
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;

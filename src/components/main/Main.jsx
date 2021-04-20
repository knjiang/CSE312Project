import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from '../../pages/Home';
import Drawer from '../../pages/Drawer';
import Login from '../../pages/Login';
import Logout from '../../pages/Logout';
import newPage from '../../pages/newPage'
import Chatroom from '../../pages/Chatroom';
import Settings from '../../pages/Settings';

const Main = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/drawer' component={Drawer}></Route>
      <Route exact path='/login' component={Login}></Route>
      <Route exact path='/logout' component={Logout}></Route>
      <Route exact path='/chatroom' component={Chatroom}></Route>
      <Route exact path='/settings' component={Settings}></Route>
      <Route exact path='/newPage' component={newPage}></Route>
      <Redirect from='/api/' to='/'></Redirect>
    </Switch>
  );
}

export default Main;
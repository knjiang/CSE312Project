import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from '../../pages/Home';
import Message from '../../pages/messages/Message';
import Drawer from '../../pages/Drawer';
import Login from '../../pages/Login';
import Logout from '../../pages/Logout';

const Main = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/drawer' component={Drawer}></Route>
      <Route exact path='/login' component={Login}></Route>
      <Route exact path='/logout' component={Logout}></Route>
      <Route exact path='/messages' component={Message}></Route>
      <Redirect from='/api/' to='/'></Redirect>
    </Switch>
  );
}

export default Main;
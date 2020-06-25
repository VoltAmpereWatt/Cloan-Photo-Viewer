import React, { Component } from 'react';
import './styles/styles.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Gallery from "./components/gallery.component";
import Navbar from "./components/navbar.component";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Login from './components/login.component';
import axios from 'axios';
import Crypto from 'crypto-js';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: true,
      username: "",
      password: "",
      signedOut: true,
      something: ''
    }
    this.gridToggle = this.gridToggle.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this);
    this.logout = this.logout.bind(this);
  }
  logout(event) {
    this.setState({ username: "", password: "", signedOut: true })
  }

  gridToggle(event) {
    this.setState({ grid: !this.state.grid })
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value })
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value })
  }


  onSubmit(e) {
    // This line prevents default HTML form submission behavior
    e.preventDefault();
    const user = {
      username: this.state.username,
      password: Crypto.SHA256(this.state.password).toString()
    }
    console.log(user)
    // Appending username to gallery url. username is extracted in route and passed to Gallery component
    // In gallery component, username prop is used to make get request and get image urls
    console.log('before post')
    axios.post('/users/login', user)
      .then((res) => {
        window.location = `/gallery/${this.state.username}`;
        this.setState({ signedOut: !this.state.signedOut })
      })
      .catch(res => setTimeout(function () {
        alert(res)
      }, 2000));
    console.log('after post')

  }

  render() {
    return (
      <Router>
        <div className={'container'}>
          <Navbar appName={'Photo Viewer'}
            username={this.state.username}
            logoutFunc={this.logout}
            signedOutFlag={this.state.signedOut} />
          {/* <Redirect to="/users/login" /> */}
          <Route path="/" exact render={(props) => <Login {...props}
            usernameChange={this.handleUsernameChange}
            passwordChange={this.handlePasswordChange}
            onSubmit={this.onSubmit} />} />
          <Route path="/gallery/:id" exact
            render={(props) => <Gallery {...props}
              username={props.match.params.id}
              galleryStyle={this.state.grid ? 'tile' : 'full'}
              gridToggle={this.gridToggle}
              gridView={this.state.grid} logoutFunc={this.logout} />} />
        </div>
        <div>
          <a href={"https://github.com/VoltAmpereWatt/Cloan-Photo-Viewer.git"} className={'source-link btn btn-light border'}>View Source</a>
        </div>
      </Router>);
  }
}


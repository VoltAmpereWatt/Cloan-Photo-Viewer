import React from 'react';
import '../styles/styles.css';
import { Link } from 'react-router-dom';

function Navbar(props) {
  return (
    <nav>
      <p className="display-4">{props.appName}</p>
      {props.signedOutFlag ?
        <div>
          <p className={'display-5'}>Demo Credentials</p>
          <p className={'display-5'}>Username: guest | Password: guestpass</p>
        </div> :
        <Link to="/" onClick={props.logoutFunc}>Logout</Link>}
    </nav>
  )
}

export default Navbar;
import React from 'react';
import '../styles/styles.css';
function Navbar(props) {
  return (
    <nav>
      <p className="display-4">{props.appName}</p>
      <p className={'display-5'}>Demo Credentials</p>
      <p className={'display-5'}>Username: guest | Password: guestpass</p>
    </nav>
  )
}

export default Navbar;
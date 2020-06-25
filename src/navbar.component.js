import React from 'react';
import './styles/styles.css';
function Navbar(props) {
  return (
    <nav>
      <p className="display-4">{props.appName}</p>
    </nav>
  )
}

export default Navbar;
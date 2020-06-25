import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';
function Navbar(props) {
  return (
    <nav>
      {/* link instead of anchor tag from react-router. 'to' param shows where it links to.*/}
      {/* className="display-4" */}
      <Link to="/">{props.appName}</Link>
      <div className="navbar-collapse">
        <ul className='navbar-nav mr-auto'>
          {/* <li className='navbar-item display-5 btn-link'><Link to='/'>{props.username}</Link></li> */}
          {/* display-5  */}
          <li className='navbar-item btn-link'
            onClick={props.signout}>
            <Link to='/create' onClick={props.signoutToggleFunc}>{props.signedOutFlag ? null : 'Sign Out'}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar;
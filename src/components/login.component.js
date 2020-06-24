import React from 'react';
import '../styles/styles.css';

function Login(props) {
  return (
    <form onSubmit={props.onSubmit}>
      <div className="form-group">
        <div>
          <input type='text'
            className={'col-md-6'}
            name={'username'}
            onChange={props.usernameChange}
            placeholder={'Username'}></input>
        </div>
        <div>
          <input type='password'
            className={'col-md-6'}
            name={'password'}
            onChange={props.passwordChange}
            placeholder={'Password'}></input>
        </div>
        <div>
          <input type={"submit"} value={"Login"} className={"btn btn-dark col-md-6"} />
          {/* <button type={'submit'} id={'login-button'} className={'btn btn-dark col-md-6'}>Login</button> */}
        </div>
      </div>
    </form>
  )
}

export default Login;
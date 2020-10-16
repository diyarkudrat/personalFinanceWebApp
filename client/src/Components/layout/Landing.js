import React, { Component } from "react";
// import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';



class Landing extends Component {
  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>Login to your PersonalFinance Application</h4>
            <br />
            <div className="col s6">
              <Button
                href="/register"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Register
              </Button>
            </div>
            <div className="col s6">
              <Button
                href="/login"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large btn-flat waves-effect white black-text"
              >
                Log In
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Landing;
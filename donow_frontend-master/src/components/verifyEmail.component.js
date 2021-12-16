import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

export class VerifyEmailComponent extends Component {
  render() {
    return (
      <div className="container text-center pt-3">
        <Link to="/">
          <img
            width="80px"
            alt="donow"
            src={process.env.PUBLIC_URL + "/logo-small.svg"}
          />
        </Link>
        <div className="mt-5 pt-3 mb-4">
          <img
            alt="success"
            width="150px"
            src={process.env.PUBLIC_URL + "/check-icon-circle.svg"}
          />
        </div>
        <div>
          <p className="h1 font-weight-bold text-pink">Verify your email!</p>
          <p className="h2 text-default-black">
            A verification link has been sent to your email address!
          </p>
        </div>
        <span
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            overflow: "hidden",
            height: "400px",
          }}
        >
          <img
            width="600px"
            className="self-align-end"
            alt="mute check"
            src={process.env.PUBLIC_URL + "/mute-check.svg"}
          />
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyEmailComponent);

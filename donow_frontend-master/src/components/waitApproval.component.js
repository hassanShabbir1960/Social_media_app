import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

export class WaitApprovalComponent extends Component {
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
            src={process.env.PUBLIC_URL + "/clock-icon.svg"}
          />
        </div>
        <div>
          <p className="h1 font-weight-bold text-pink">Wait For Approval!</p>
          <p className="h3 text-pink">
            Wait until your content is approved by our team
          </p>
        </div>
        <span
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            overflow: "hidden",
            height: "280px",
            width: "280px",
          }}
        >
          <img
            width="300px"
            alt="mute check"
            src={process.env.PUBLIC_URL + "/mute-clock.svg"}
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
)(WaitApprovalComponent);

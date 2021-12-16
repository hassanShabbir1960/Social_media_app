import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ProfileMenu from "./profileMenu.component";
import { authLogout } from "../store/actions/auth";
import "../css/header.css";

class HeaderComponent extends Component {
  Logout = () => {
    this.props.logout();
  };
  render() {
    return (
      <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-white navbar-shadow">
        <Link className="navbar-brand" to="/">
          <img
            alt="donow"
            height="60px"
            src={process.env.PUBLIC_URL + "/logo.svg"}
          ></img>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto"></ul>
          {window.location.pathname === process.env.PUBLIC_URL + "/home" ? (
            <div>
              <Link to="/about" className="alert-link text-default-black mr-4">
                About
              </Link>
              <Link
                to="/contact"
                className="alert-link text-default-black mr-4"
              >
                Contact
              </Link>
              <Link
                to="/discover/workshops"
                className="alert-link text-default-black mr-4"
              >
                Workshops
              </Link>
              <Link
                to="/discover/creators"
                className="alert-link text-default-black mr-4"
              >
                Creators
              </Link>
              <Link
                to="/create-workshop"
                className="btn btn-pink btn-sm px-3 mr-4 rounder"
              >
                Not a creator yet?
              </Link>
              <span className="d-inline-block">
                <ProfileMenu></ProfileMenu>
              </span>
            </div>
          ) : window.location.pathname ===
              process.env.PUBLIC_URL + "/profile" ||
            window.location.pathname === process.env.PUBLIC_URL + "/admin" ? (
            <div>
              <button
                onClick={this.Logout}
                className="btn-solid-link alert-link text-pink mr-4"
              >
                Logout
              </button>
            </div>
          ) : window.location.pathname === process.env.PUBLIC_URL ? (
            <div>
              <Link to="/sign-up">
                <button className="btn btn-default-black mr-3 rounded">
                  Sign Up
                </button>
              </Link>
              <Link to="/login">
                <button className="btn btn-pink mr-2 rounded">Login</button>
              </Link>
            </div>
          ) : window.location.pathname === process.env.PUBLIC_URL + "/login" ? (
            <div>
              <Link className="alert-link text-pink mr-3" to="/create-workshop">
                Become Creator
              </Link>
              <Link className="alert-link text-pink mr-3" to="/sign-up">
                Signup
              </Link>
            </div>
          ) : window.location.pathname.includes("/user/payment") ? (
            <div>
              <Link
                className="alert-link text-pink mr-3"
                to="/user/payment/balance"
              >
                Balance
              </Link>
              <Link
                className="alert-link text-pink mr-3"
                to="/user/payment/invoice"
              >
                Invoice
              </Link>
              <span className="d-inline-block">
                <ProfileMenu></ProfileMenu>
              </span>
            </div>
          ) : this.props.isAuthenticated ? (
            <div>
              <span className="d-inline-block">
                <ProfileMenu></ProfileMenu>
              </span>
            </div>
          ) : (
            <div>
              <Link className="alert-link text-pink mr-3" to="/login">
                Login
              </Link>
              <Link className="alert-link text-pink mr-3" to="/sign-up">
                Signup
              </Link>
            </div>
          )}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  if (!state.authReducer.loading) {
    return {
      isloading: state.authReducer.loading,
      isAuthenticated: state.authReducer.loggedIn,
    };
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(authLogout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);

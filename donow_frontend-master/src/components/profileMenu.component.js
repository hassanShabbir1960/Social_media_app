import React, { Component } from "react";
import { Link } from "react-router-dom";
import { authLogout } from "../store/actions/auth";
import { connect } from "react-redux";
import APIService from "../services/apiRequest.service";
import StaticData from "./StaticData";

class ProfileMenu extends Component {
  componentDidMount() {
    APIService.fetchUser()
      .then((res) => {
        this.setState({
          user: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  state = {
    user: {},
  };

  Logout = () => {
    this.props.logout();
  };
  render() {
    return (
      <div className="dropdown">
        <button
          className="btn btn-link text-default-black"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          style={{ textDecoration: "none" }}
        >
          <span className="mr-2">
            Hi, <strong>{this.state.user.first_name}</strong>
          </span>
          <img
            alt="profile"
            src={
              this.state.user.profile_image
                ? StaticData.BEURL + this.state.user.profile_image
                : process.env.PUBLIC_URL + "/user-icon.svg"
            }
            width="40px"
            height="40px"
            className="rounded-circle border border-mute"
          ></img>
        </button>
        <div
          className="dropdown-menu dropdown-menu-lg-right bg-pink"
          aria-labelledby="dropdownMenuButton"
        >
          <Link
            className="dropdown-item style-link bg-pink text-white"
            to={"/profile/" + this.state.user.id}
          >
            <i className="fa fa-user mr-2"></i>
            <span>Profile</span>
          </Link>
          <Link
            className="dropdown-item style-link bg-pink text-white"
            to="/user/favorites/"
          >
            <i className="fa fa-star mr-2"></i>
            <span>Favorites</span>
          </Link>
          <Link
            className="dropdown-item style-link bg-pink text-white"
            to="/user/course-management/"
          >
            <i className="fa fa-book mr-2"></i>
            <span>Course Management</span>
          </Link>
          <Link
            className="dropdown-item style-link bg-pink text-white"
            to="/user/purchases/"
          >
            <i className="fa fa-shopping-bag mr-2"></i>
            <span>Purchased Courses</span>
          </Link>
          <Link
            className="dropdown-item style-link bg-pink text-white"
            to="/user/cart/"
          >
            <i className="fa fa-shopping-cart mr-2"></i>
            <span>My Cart</span>
          </Link>
          <Link
            className="dropdown-item style-link bg-pink text-white"
            to="/user/payment/"
          >
            <i className="fa fa-credit-card mr-2"></i>
            <span>Payment</span>
          </Link>
          <div className="dropdown-divider"></div>
          <Link
            onClick={this.Logout}
            className="dropdown-item style-link bg-pink text-white"
            to="/"
          >
            <i className="fa fa-power-off mr-2"></i>
            <span>Logout</span>
          </Link>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(authLogout()),
  };
};

export default connect(null, mapDispatchToProps)(ProfileMenu);

import React, { Component } from "react";
import { Link } from "react-router-dom";
import FooterComponent from "./footer.component";
import { connect } from "react-redux";
import Validator from "validator";
import HeaderComponent from "./header.component";
import APIService from "../services/apiRequest.service";
import { authLogout } from "../store/actions/auth";
import StaticData from "./StaticData";

class ProfileEditComponent extends Component {
  componentDidMount() {
    APIService.fetchUserDetails()
      .then((res) => {
        this.setState({
          data: res.data.user_details,
        });
        this.setState({
          data: {
            ...this.state.data,
            username: res.data.user.username,
            email: res.data.user.email,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });

    this.updateLocations({
      target: {
        value: "",
      },
    });
  }
  state = {
    loading: false,
    errors: {},
    data: {},
    countries: [],
  };

  updateLocations = (e) => {
    var countries = require("country-list").getNames();
    countries = countries.filter((item) => {
      return item.toLowerCase().includes(e.target.value);
    });
    this.setState({ countries: countries });
  };

  onChange = (e) => {
    if (e.target.type && e.target.type === "file") {
      this.setState({
        data: {
          ...this.state.data,
          [e.target.name]: URL.createObjectURL(e.target.files[0]),
          image_file: e.target.files[0],
        },
      });
    } else {
      this.setState({
        data: { ...this.state.data, [e.target.name]: e.target.value },
      });
    }
  };

  onSubmit = async (e) => {
    e.persist();
    const { data } = this.state;
    e.preventDefault();
    e.stopPropagation();
    for (var field of e.target) {
      field.classList.remove("is-invalid");
    }
    const errors = await this.validate(data);
    this.setState({ errors });

    if (Object.keys(errors).length) {
      for (var key in errors) {
        e.target[key].classList.add("is-invalid");
      }
      return;
    }

    console.log(data.image_file);
    APIService.editUserDetails(data)
      .then((res) => {
        if (this.props.user.email !== res.data["Data"][0]["email"]) {
          // console.log("emails different")
          // this.props.logout()
          // this.props.history.push('/')
        } else {
          this.props.history.push("/profile/" + this.props.user.id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  validate = async (data) => {
    const errors = {};
    if (!data.username) errors.username = "Field cannot be empty!";
    else {
      if (!Validator.isLength(data.username, { min: 3, max: undefined }))
        errors.username = "Minimum valid length is 3";
      if (!Validator.isLength(data.username, { min: undefined, max: 20 }))
        errors.username = "Maximum valid length is 20";
      if (!Validator.isAlphanumeric(data.username))
        errors.username = "Can only contain alphabets and numbers";
      if (data.username !== this.props.user.username) {
        await APIService.validateUsername(data.username).then((res) => {
          if (!res.data.status) {
            errors.username = "Username is not available!";
          }
        });
      }
    }
    if (!data.first_name) errors.first_name = "Field cannot be empty!";
    else {
      if (!Validator.isAlpha(data.first_name)) {
        errors.first_name = "Can only contain alphabets!";
      }
      if (!Validator.isLength(data.first_name, { min: undefined, max: 30 }))
        errors.first_name = "Maximum valid length is 30";
    }
    if (!data.last_name) errors.last_name = "Field cannot be empty!";
    else {
      if (!Validator.isAlpha(data.last_name)) {
        errors.last_name = "Can only contain alphabets!";
      }
      if (!Validator.isLength(data.last_name, { min: undefined, max: 30 }))
        errors.last_name = "Maximum valid length is 30";
    }
    if (data.age) {
      if (!Validator.isInt(data.age.toString())) {
        errors.age = "Age must be entered numerically!";
      } else if (data.age < 10 || data.age > 150)
        errors.age = "Please enter a valid age greater than 10";
    }
    if (!data.email) errors.email = "Field cannot be empty!";
    else if (!Validator.isEmail(data.email)) {
      errors.email = "Please provide an email here";
    } else if (data.email !== this.props.user.email) {
      await APIService.validateEmail(data.email).then((res) => {
        if (!res.data.status) {
          errors.email = "This email is already registered!";
        }
      });
    }
    if (!data.old_password) errors.old_password = "Field cannot be empty!";
    else {
      await APIService.validatePassword(data.old_password).then((res) => {
        if (!res.data.status) {
          errors.old_password = "Incorrect Password!";
        }
      });
    }
    if (
      data.new_password1 &&
      !Validator.isLength(data.new_password1, { min: 5, max: undefined })
    ) {
      errors.new_password1 = "Minimum valid length is 5";
    } else if (data.new_password1 !== data.new_password2) {
      errors.new_password2 = "Passwords do not match!";
    }

    return errors;
  };

  render() {
    const { data, errors, countries } = this.state;
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div className="container-fluid mt-5">
          <form onSubmit={this.onSubmit}>
            <div className="row">
              <div className="col-1 d-xl-block d-none"></div>
              <div className="col-lg-4 col-sm-6 col-12 text-center">
                <div>
                  <label style={{ cursor: "pointer" }}>
                    <input
                      type="file"
                      name="profile_image"
                      accept="image/jpeg, image/png"
                      className="d-none"
                      onChange={this.onChange}
                    />
                    {!data.image_file ? (
                      <span
                        className="text-default-black"
                        style={{
                          position: "absolute",
                          fontSize: "70px",
                          marginLeft: "25px",
                          marginTop: "-10px",
                          opacity: "0.4",
                        }}
                      >
                        +
                      </span>
                    ) : undefined}
                    <img
                      alt="profile"
                      src={
                        data.profile_image
                          ? data.image_file
                            ? data.profile_image
                            : StaticData.BEURL + data.profile_image
                          : process.env.PUBLIC_URL + "/user-icon.svg"
                      }
                      width="100px"
                      height="100px"
                      className="rounded-circle border border-mute"
                    ></img>

                    <p className="font-weight-bold text-default-black">
                      Change Icon
                    </p>
                  </label>
                  <small className="text-danger w-100 text-center">
                    {errors.profile_image}
                  </small>
                </div>

                <div className="input-group input-group mt-3 mb-3">
                  <div className="input-group-prepend">
                    <div
                      className="text-pink input-group-icon"
                      id="inputGroup-sizing-sm"
                      style={{ padding: "7px" }}
                    >
                      <i
                        className="fa fa-user-o"
                        style={{ fontSize: "large" }}
                      ></i>
                    </div>
                  </div>
                  <input
                    name="username"
                    type="text"
                    value={data.username}
                    className="form-control rounder"
                    placeholder="Edit Username"
                    onChange={this.onChange}
                  />
                  <small className="text-danger w-100 text-center">
                    {errors.username}
                  </small>
                </div>
                <div className="input-group input-group mt-3 mb-3">
                  <div className="input-group-prepend">
                    <div
                      className="text-pink input-group-icon"
                      id="inputGroup-sizing-sm"
                      style={{ padding: "7px" }}
                    >
                      <i
                        className="fa fa-address-card-o"
                        style={{ fontSize: "large" }}
                      ></i>
                    </div>
                  </div>
                  <input
                    name="first_name"
                    type="text"
                    value={data.first_name}
                    className="form-control rounder"
                    placeholder="Edit First Name"
                    onChange={this.onChange}
                  />
                  <small className="text-danger w-100 text-center">
                    {errors.first_name}
                  </small>
                </div>
                <div className="input-group input-group mt-3 mb-3">
                  <div className="input-group-prepend">
                    <div
                      className="text-pink input-group-icon"
                      id="inputGroup-sizing-sm"
                      style={{ padding: "7px" }}
                    >
                      <i
                        className="fa fa-address-card-o text-white"
                        style={{ fontSize: "large" }}
                      ></i>
                    </div>
                  </div>
                  <input
                    name="last_name"
                    type="text"
                    value={data.last_name}
                    className="form-control rounder"
                    placeholder="Edit Last Name"
                    onChange={this.onChange}
                  />
                  <small className="text-danger w-100 text-center">
                    {errors.last_name}
                  </small>
                </div>
                <div className="input-group input-group mb-3">
                  <div className="input-group-prepend">
                    <div
                      className="text-pink input-group-icon"
                      id="inputGroup-sizing-sm"
                      style={{ padding: "7px" }}
                    >
                      <i
                        className="fa fa-edit"
                        style={{ fontSize: "large" }}
                      ></i>
                    </div>
                  </div>
                  <textarea
                    name="bio"
                    type="text"
                    value={this.state.data.bio}
                    className="form-control rounder"
                    rows="3"
                    style={{ resize: "none", overflow: "hidden" }}
                    onChange={(e) => {
                      e.target.rows = 3;
                      e.target.rows = e.target.scrollHeight / 24;
                      this.onChange(e);
                    }}
                  ></textarea>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6 col-12 text-left">
                <div className="input-group input-group mb-4">
                  <div className="input-group-prepend">
                    <div
                      className="text-pink input-group-icon"
                      id="inputGroup-sizing-sm"
                      style={{ padding: "7px" }}
                    >
                      <i
                        className="fa fa-leaf"
                        style={{ fontSize: "large" }}
                      ></i>
                    </div>
                  </div>
                  <input
                    name="age"
                    type="number"
                    min={10}
                    max={150}
                    value={data.age}
                    className="form-control py-4 rounder"
                    placeholder="Edit Age"
                    onChange={this.onChange}
                  />
                  <small className="w-100 text-danger text-center">
                    {errors.age}
                  </small>
                </div>
                <div className="input-group input-group mb-4">
                  <div className="input-group-prepend">
                    <div
                      className="text-pink input-group-icon"
                      id="inputGroup-sizing-sm"
                      style={{ padding: "7px" }}
                    >
                      <i
                        className="fa fa-flag-o"
                        style={{ fontSize: "large" }}
                      ></i>
                    </div>
                  </div>
                  <div className="flex-fill border border-grey rounder py-1">
                    <div className="dropdown w-100">
                      <div
                        className="btn btn-block text-left rounder text-truncate"
                        style={{ maxWidth: "380px" }}
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {data.location ? data.location : "Select Location"}
                      </div>
                      <div
                        class="dropdown-menu w-100 no-scrollbar rounder"
                        style={{
                          maxHeight: "60vh",
                          overflowY: "scroll",
                          position: "relative",
                        }}
                        aria-labelledby="dropdownMenuButton"
                      >
                        <div class="dropdown-text px-3">
                          <input
                            className="form-control rounder form-control-sm"
                            name="search_location"
                            placeholder="Search"
                            onChange={this.updateLocations}
                          />
                        </div>
                        {countries.map((country) => (
                          <div>
                            <button
                              className="px-2 dropdown-item text-truncate font-weight-bold text-black-default"
                              type="button"
                              onClick={(e) => {
                                this.onChange({
                                  target: {
                                    name: "location",
                                    value: country,
                                  },
                                });
                              }}
                            >
                              {country}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <small className="text-danger w-100 text-center">
                      {errors.location}
                    </small>
                  </div>
                </div>
                <div className="input-group input-group mb-4">
                  <div className="input-group-prepend">
                    <div
                      className="text-pink input-group-icon"
                      id="inputGroup-sizing-sm"
                      style={{ padding: "7px" }}
                    >
                      <i
                        className="fa fa-envelope-o"
                        style={{ fontSize: "large" }}
                      ></i>
                    </div>
                  </div>
                  <input
                    name="email"
                    type="text"
                    value={data.email}
                    className="form-control py-4 rounder"
                    placeholder="Edit Age"
                    onChange={this.onChange}
                  />
                  <small className="text-danger w-100 text-center">
                    {errors.email}
                  </small>
                </div>

                <div className="input-group input-group mb-4">
                  <div className="input-group-prepend">
                    <div
                      className="text-pink input-group-icon"
                      id="inputGroup-sizing-sm"
                      style={{ padding: "7px" }}
                    >
                      <i
                        className="fa fa-lock"
                        style={{ fontSize: "large" }}
                      ></i>
                    </div>
                  </div>
                  <input
                    name="old_password"
                    type="password"
                    className="form-control py-4 rounder"
                    placeholder="Enter Current Password"
                    onChange={this.onChange}
                  />
                  <small className="text-danger w-100 text-center">
                    {errors.old_password}
                  </small>
                </div>
                <div className="input-group input-group mb-4">
                  <div className="input-group-prepend">
                    <div
                      className="text-white input-group-icon"
                      id="inputGroup-sizing-sm"
                      style={{ padding: "7px" }}
                    >
                      <i
                        className="fa fa-lock"
                        style={{ fontSize: "large" }}
                      ></i>
                    </div>
                  </div>
                  <input
                    name="new_password1"
                    type="password"
                    className="form-control py-4 rounder"
                    placeholder="Enter New Password"
                    onChange={this.onChange}
                  />
                  <small className="text-danger w-100 text-center">
                    {errors.new_password1}
                  </small>
                </div>
                <div className="input-group input-group mb-4">
                  <div className="input-group-prepend">
                    <div
                      className="text-white input-group-icon"
                      id="inputGroup-sizing-sm"
                      style={{ padding: "7px" }}
                    >
                      <i
                        className="fa fa-lock"
                        style={{ fontSize: "large" }}
                      ></i>
                    </div>
                  </div>
                  <input
                    name="new_password2"
                    type="password"
                    className="form-control py-4 rounder"
                    placeholder="Re-type New Password"
                    onChange={this.onChange}
                  />
                  <small className="text-danger w-100 text-center">
                    {errors.new_password2}
                  </small>
                </div>
                <div className="mt-5 w-100 text-center">Add Social Media</div>
                <div className="mb-1 w-100 text-center lead">
                  <a
                    href="#for-instagram"
                    className="text-dark mx-2"
                    data-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="for-instagram"
                  >
                    <i className="fa fa-instagram"></i>
                  </a>
                  <a
                    href="#for-yt"
                    className="text-dark mx-2"
                    data-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="for-yt"
                  >
                    <i className="fa fa-youtube"></i>
                  </a>
                  <a
                    href="#for-twitter"
                    className="text-dark mx-2"
                    data-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="for-twitter"
                  >
                    <i className="fa fa-twitter"></i>
                  </a>
                  <a
                    href="#for-fb"
                    className="text-dark mx-2"
                    data-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="for-fb"
                  >
                    <i className="fa fa-facebook"></i>
                  </a>
                  <a
                    href="#for-pintrest"
                    className="text-dark mx-2"
                    data-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="for-pintrest"
                  >
                    <i className="fa fa-pinterest-p"></i>
                  </a>
                </div>

                <small className="text-danger w-100 text-center">
                  {errors.socialmedia}
                </small>
                <div className="collapse" id="for-instagram">
                  <div className="input-group input-group mb-4">
                    <input
                      name="instagram_profile"
                      value={this.state.data.instagram_profile}
                      type="url"
                      className="form-control rounder"
                      placeholder="Instagram Profile Link"
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <div className="collapse" id="for-yt">
                  <div className="input-group input-group mb-4">
                    <input
                      name="youtube_profile"
                      value={this.state.data.youtube_profile}
                      type="url"
                      className="form-control rounder"
                      placeholder="Youtube Profile Link"
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <div className="collapse" id="for-twitter">
                  <div className="input-group input-group mb-4">
                    <input
                      name="twitter_profile"
                      value={this.state.data.twitter_profile}
                      type="url"
                      className="form-control rounder"
                      placeholder="Twitter Profile Link"
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <div className="collapse" id="for-fb">
                  <div className="input-group input-group mb-4">
                    <input
                      name="facebook_profile"
                      value={this.state.data.facebook_profile}
                      type="url"
                      className="form-control rounder"
                      placeholder="Facebook Profile Link"
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <div className="collapse" id="for-pintrest">
                  <div className="input-group input-group mb-4">
                    <input
                      name="pinterest_profile"
                      value={this.state.data.pinterest_profile}
                      type="url"
                      className="form-control rounder"
                      placeholder="Pintrest Profile Link"
                      onChange={this.onChange}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-12 text-center pt-3">
                <strong>
                  <span className="mr-2">
                    <span className="text-pink">{this.state.data.followers}</span> Followers
                  </span>
                  {"|"}
                  <span className="ml-2">
                    <span className="text-pink">{this.state.data.following}</span> Following
                  </span>
                </strong>
              </div>
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="btn-solid-link btn-lg font-weight-bold text-pink mx-3"
                style={{ textDecoration: "none" }}
              >
                Save
              </button>
              <Link to={"/profile/" + data.user}>
                <button
                  className="btn-solid-link btn-lg font-weight-bold text-pink mx-3"
                  style={{ textDecoration: "none" }}
                >
                  Discard
                </button>
              </Link>
            </div>
          </form>
        </div>
        <div style={{ paddingTop: "20%" }}></div>
        <FooterComponent></FooterComponent>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(authLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileEditComponent);

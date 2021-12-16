import React from "react";
import { Link, Redirect } from "react-router-dom";
import Validator from "validator";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";
import HeaderComponent from "./header.component";
import Loader from "react-loader-spinner";

class SignupComponent extends React.Component {
  state = {
    data: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      bio: "",
    },
    loading: false,
    errors: {},
  };

  onChange = (e) => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value },
    });
  };

  onSubmit = (e) => {
    const { data } = this.state;
    e.preventDefault();
    e.stopPropagation();
    for (var field of e.target) {
      field.classList.remove("is-invalid");
    }
    const errors = this.validate(data);
    this.setState({ errors });
    if (Object.keys(errors).length) {
      for (var key in errors) {
        e.target[key].classList.add("is-invalid");
      }
      return;
    }

    this.setState({
      loading: true,
    });

    this.props.onAuth(
      data.firstname,
      data.lastname,
      data.username,
      data.email,
      data.password,
      data.bio
    );
  };

  validate = (data) => {
    const errors = {};
    if (!data.firstname) errors.firstname = "Field cannot be empty!";
    else {
      if (!Validator.isAlpha(data.firstname)) {
        errors.firstname = "Can only contain alphabets!";
      }
      if (!Validator.isLength(data.firstname, { min: undefined, max: 30 }))
        errors.username = "Maximum valid length is 30";
    }
    if (!data.lastname) errors.lastname = "Field cannot be empty!";
    else {
      if (!Validator.isAlpha(data.lastname)) {
        errors.lastname = "Can only contain alphabets!";
      }
      if (!Validator.isLength(data.lastname, { min: undefined, max: 30 }))
        errors.username = "Maximum valid length is 30";
    }
    if (!data.username) errors.username = "Field cannot be empty!";
    else {
      if (!Validator.isLength(data.username, { min: 3, max: undefined }))
        errors.username = "Minimum valid length is 3";
      if (!Validator.isLength(data.username, { min: undefined, max: 20 }))
        errors.username = "Maximum valid length is 20";
      if (!Validator.isAlphanumeric(data.username))
        errors.username = "Can only contain alphabets and numbers";
    }
    if (!data.email) errors.email = "Field cannot be empty!";
    if (!data.password) errors.password = "Field cannot be empty!";
    if (data.email && !Validator.isEmail(data.email))
      errors.email = "Please provide an email here";
    if (
      data.password &&
      !Validator.isLength(data.password, { min: 5, max: undefined })
    )
      errors.password = "Minimum valid length is 5";

    console.log(errors);
    return errors;
  };

  render() {
    if (this.props.loggedIn && this.props.user_status==="nonadmin") {
      //  redirect if logged in
      return <Redirect to="/home" />;
    } else if (!this.props.loading && this.state.loading) {
      this.setState({
        loading: false,
      });
    }
    if (this.props.WaitforActivation) {
      return <Redirect to="/verify-email" />;
    }
    const { data, errors } = this.state;
    return (
      <div>
        <HeaderComponent></HeaderComponent>

        <div className="container-fluid row text-center mt-3">
          <div className="col-4"></div>
          <div className="col-md-4 col-12">
            <form className="needs-validation" onSubmit={this.onSubmit}>
              <h2 className="text-default-black mb-4">SignUp</h2>
              <div className="form-row mb-3">
                <div className="col-6">
                  <div className="input-group input-group">
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
                      name="firstname"
                      value={data.firstname}
                      onChange={this.onChange}
                      type="text"
                      style={{ textTransform: "capitalize" }}
                      className="form-control rounder"
                      placeholder="First Name"
                    />
                  </div>
                  <small className="text-danger w-100">
                    {errors.firstname}
                  </small>
                </div>
                <div className="col-6">
                  <input
                    name="lastname"
                    value={data.lastname}
                    onChange={this.onChange}
                    style={{ textTransform: "capitalize" }}
                    type="text"
                    className="form-control rounder"
                    placeholder="Last Name"
                  />
                  <small className="text-danger w-100">{errors.lastname}</small>
                </div>
              </div>
              <div className="input-group input-group mb-3">
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
                  value={data.username}
                  onChange={this.onChange}
                  type="text"
                  className="form-control rounder"
                  placeholder="Username"
                />
                <small className="text-danger w-100">{errors.username}</small>
              </div>
              <div className="input-group input-group mb-3">
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
                  value={data.email}
                  onChange={this.onChange}
                  type="email"
                  className="form-control rounder"
                  placeholder="Email"
                />
                <small className="text-danger w-100">
                  {this.state.errors.email}
                </small>
              </div>
              <div className="input-group input-group mb-3">
                <div className="input-group-prepend">
                  <div
                    className="text-pink input-group-icon"
                    id="inputGroup-sizing-sm"
                    style={{ padding: "7px" }}
                  >
                    <i className="fa fa-lock" style={{ fontSize: "large" }}></i>
                  </div>
                </div>
                <input
                  name="password"
                  value={data.password}
                  onChange={this.onChange}
                  type="password"
                  className="form-control rounder"
                  placeholder="Password"
                />
                <small className="text-danger w-100">{errors.password}</small>
              </div>
              <div className="input-group input-group mb-0">
                <div className="input-group-prepend">
                  <div
                    className="text-pink input-group-icon"
                    id="inputGroup-sizing-sm"
                    style={{ padding: "7px" }}
                  >
                    <i className="fa fa-edit" style={{ fontSize: "large" }}></i>
                  </div>
                </div>
                <textarea
                  name="bio"
                  value={data.bio}
                  type="text"
                  className="form-control rounder"
                  rows="3"
                  maxLength="500"
                  placeholder="Add bio"
                  style={{ resize: "none", overflow: "hidden" }}
                  onChange={(e) => {
                    e.target.rows = 3;
                    e.target.rows = e.target.scrollHeight / 24;
                    this.onChange(e);
                  }}
                ></textarea>
              </div>
              <div className="text-right text-muted mb-3">
                <small>{data.bio.length}/500</small>
              </div>
              <button
                type="submit"
                className="btn btn-pink rounder"
                style={{ paddingInline: "10%" }}
              >
                <div className="d-flex justify-content-between">
                  <div>Sign Up</div>
                  {this.props.loading && this.state.loading && (
                    <Loader
                      className="ml-3"
                      type="TailSpin"
                      color="#cd9999"
                      height={20}
                      width={20}
                    />
                  )}
                </div>
              </button>
              <p className="small ml-5 mr-5 text-center mb-0">
                By signing up, you are accepting Donow's
                <Link to="" className="alert-link text-default-black ml-1">
                  Terms of Service
                </Link>
                ,{" "}
                <Link to="/" className="alert-link text-default-black ml-1">
                  {" "}
                  Privacy Policy
                </Link>
              </p>
              <strong className="text-default-black mt-0 h3">OR</strong>

              <button
                type="submit"
                className="btn btn-primary btn-block rounder mt-1"
              >
                <i className="fa fa-facebook mr-2"></i>
                Continue with Facebook
              </button>

              <button
                type="submit"
                className="btn btn-secondary btn-block rounder"
                style={{ paddingInline: "10%" }}
              >
                <i className="fa fa-google mr-2"></i>
                Continue with Google
              </button>
              <p className="small">
                Already have an account?{" "}
                <Link to="/login" className="alert-link text-default-black">
                  Login
                </Link>{" "}
                instead
              </p>
            </form>
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.authReducer.loading,
    error: state.authReducer.error,
    loggedIn: state.authReducer.loggedIn,
    user_status: state.authReducer.user_status,
    WaitforActivation: state.authReducer.WaitforActivation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (firstname, lastname, username, email, password, bio) =>
      dispatch(
        actions.authSignup(firstname, lastname, username, email, password, bio)
      ),
  };
};

// export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
export default connect(mapStateToProps, mapDispatchToProps)(SignupComponent);

import React, { Component } from "react";
import HeaderComponent from "./header.component";
import FooterComponent from "./footer.component";
import "../css/static-pages.css";
import Dropzone from "react-dropzone";
import Validator from "validator";
import APIService from "../services/apiRequest.service";

export default class ContactUsComponent extends Component {
  fileDrop = (acceptedFiles) => {
    // console.log(acceptedFiles)
    acceptedFiles.forEach((file) => {
      this.state.data.attachments.push(file);
      let number = this.state.data.attachments.length;
      let p = document.createElement("p");
      p.innerText =
        number.toString() + ": " + this.state.data.attachments[number - 1].name;
      document.getElementById("dropText").appendChild(p);
    });
  };

  onSubmit = (e) => {
    const { data } = this.state;
    e.preventDefault();
    e.stopPropagation();
    for (var field of e.target) {
      if (field.classList) field.classList.remove("is-invalid");
    }
    const errors = this.validate(data);
    this.setState({ errors });
    if (Object.keys(errors).length) {
      for (var key in errors) {
        if (e.target[key] && e.target[key].classList)
          e.target[key].classList.add("is-invalid");
      }
      return;
    }
    APIService.createContactUsRecord(this.state.data)
      .then((res) => {
        console.log(res.data);
        this.setState({
          errors: {
            ...this.state.errors,
            creation: "we have received your response",
          },
        });
      })
      .catch((err) => {
        this.setState({
          errors: {
            ...this.state.errors,
            creation: "Some error occurred during creation",
          },
        });
      });
  };
  validate = (data) => {
    const errors = {};
    if (!data.email) {
      errors.email = "Field cannot be empty!";
    }
    if (data.email && !Validator.isEmail(data.email)) {
      errors.email = "Please enter a valid email!";
    }
    if (!data.description) {
      errors.description = "Field cannot be empty!";
    }
    if (!data.subject) {
      errors.subject = "Field cannot be empty!";
    }
    if (data.issue === "Issue") {
      errors.issue = "Please select an issue type!";
    }
    return errors;
  };
  onChange = (e) => {
    if (e.target.type === "file") {
      this.setState({
        data: {
          ...this.state.data,
          [e.target.name]: e.target.files[0],
        },
      });
    } else {
      this.setState({
        data: { ...this.state.data, [e.target.name]: e.target.value },
      });
    }
  };
  onClick = (e) => {
    if (e.persist) e.persist();
    this.setState((state) => {
      return {
        data: { ...this.state.data, [e.target.id]: e.target.innerText },
      };
    });
  };

  state = {
    data: {
      email: "",
      subject: "",
      description: "",
      issue: "Issue",
      attachments: [],
    },
    errors: {},
  };

  render() {
    const DefaultIssues = [
      "Job Application",
      "Authentication Issues",
      "Website Design",
      "Content Access",
      "Payment Conflicts",
      "Other",
    ];
    const { data, errors } = this.state;
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div className="container-fluid row m-0 justify-content-center top-pan">
          <div className="text-center">
            <h1>Contact Us</h1>
            <p>We will respond to your queries</p>
          </div>
        </div>
        <div className="full-page">
          <div className="row container-fluid m-0 mt-5 mb-lg-5">
            <div className="col-md-6 col-12 contact-us-form">
              <h4>Submit a request</h4>
              <form onSubmit={this.onSubmit}>
                <label className="mt-4 text-pink font-weight-bold">
                  Email address
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  style={{ borderRadius: "30px" }}
                  name="email"
                  placeholder="Enter Email"
                  onChange={this.onChange}
                  value={data.email}
                />
                <div>
                  <small className="text-danger w-100">{errors.email}</small>
                </div>
                <label className="mt-4 text-pink font-weight-bold">
                  Subject
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg "
                  style={{ borderRadius: "30px" }}
                  name="subject"
                  placeholder="Enter Subject"
                  onChange={this.onChange}
                  value={data.subject}
                />
                <div>
                  <small className="text-danger w-100">{errors.subject}</small>
                </div>
                <label className="mt-4 text-pink font-weight-bold">
                  Description
                </label>
                <textarea
                  name="description"
                  type="text"
                  placeholder="Describe your issue briefly"
                  value={data.description}
                  className="form-control rounder"
                  rows="4"
                  style={{ resize: "none", overflow: "hidden" }}
                  onChange={(e) => {
                    e.target.rows = 4;
                    e.target.rows = e.target.scrollHeight / 24;
                    this.onChange(e);
                  }}
                ></textarea>
                <div>
                  <small className="text-danger w-100">
                    {errors.description}
                  </small>
                </div>
                <label className="mt-4 text-pink font-weight-bold">
                  Your issue
                </label>
                <div className="dropdown w-75">
                  <button
                    className="btn btn-block btn-lg border border-mute d-flex justify-content-between"
                    type="button"
                    style={{ borderRadius: "30px" }}
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="text-default-black">{data.issue}</span>
                    <i
                      className="text-default-black fa fa-caret-down"
                      style={{ fontSize: "30px" }}
                    ></i>
                  </button>
                  <ul
                    className="dropdown-menu w-100 pt-3 border-top-0"
                    aria-labelledby="dropdownMenuButton"
                  >
                    {DefaultIssues.map((item) => (
                      <li
                        key={item}
                        className="btn btn-link font-weight-bold dropdown-item"
                        onClick={this.onClick}
                        id="issue"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <small className="text-danger w-100">{errors.issue}</small>
                </div>
                <label className="mt-4 text-pink font-weight-bold">
                  Attachments
                </label>
                <div
                  className="gray text-center rounder p-3"
                  style={{ color: "gray" }}
                >
                  <Dropzone
                    onDrop={this.fileDrop}
                    accept="image/jpeg, image/png"
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div id="dropText" {...getRootProps()}>
                          <input {...getInputProps()} />
                          <p>
                            Drag 'n' drop some files here, or
                            <span className="font-weight-bold font-italic">
                              {" "}
                              click{" "}
                            </span>
                            to select files
                          </p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                  <div>
                    <small className="text-danger w-100">
                      {errors.attachments}
                    </small>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-pink rounder mt-3 float-right"
                >
                  Submit
                </button>
                <div className="d-flex justify-content-center">
                  <small className="text-danger">{errors.creation}</small>
                </div>
              </form>
            </div>
            <div
              className="col-md-6 col-12"
              style={{ paddingLeft: "25%", paddingTop: "5%" }}
            >
              <div className="mb-5 gaib">
                <img
                  className="img-fluid"
                  src={process.env.PUBLIC_URL + "/contact-us.svg"}
                  alt="..."
                  width="100%"
                ></img>
              </div>
              <div className="row">
                <div className="col-md-7 col-12">
                  <p className="font-light">Our Office</p>
                  <p className="m-0">DoNow LLC</p>
                  <p className="m-0">410 E Santa Clara Street</p>
                  <p className="m-0">San Jose, CA 95113</p>
                </div>
                <div className="col-md-5 col-12 gaib">
                  <img
                    className="img-fluid"
                    src={process.env.PUBLIC_URL + "/location.svg"}
                    alt="..."
                    width="65%"
                  ></img>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterComponent></FooterComponent>
      </div>
    );
  }
}

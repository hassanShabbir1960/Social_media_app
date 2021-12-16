import React, { Component } from "react";
import { connect } from "react-redux";
import FooterComponent from "./footer.component";
import { Link } from "react-router-dom";
import HeaderComponent from "./header.component";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import validator from "validator";
import APIService from "../services/apiRequest.service";

class AddPaymentComponent extends Component {
  async componentDidMount() {
    if (this.props.location.state) {
      await this.setState({
        payment: this.props.location.state.payment,
      });
      if (this.state.payment.expirationdate) {
        await this.setState({
          payment: {
            ...this.state.payment,
            expirationdate: new Date(this.state.payment.expirationdate * 1000),
          },
        });
      }
    }
  }

  onSubmit = async () => {
    const errors = this.validate(this.state);
    this.setState({ errors: errors });
    if (Object.keys(errors).length > 0) {
      return;
    }
    if (this.state.payment.id) {
      await APIService.UpdatePayment(this.state.payment).then((res) => {
        this.props.history.push("/user/payment/");
      });
    } else {
      await APIService.AddPayment(this.state.payment).then((res) => {
        this.props.history.push("/user/payment/");
      });
    }
  };

  validate = (state) => {
    let errors = {};
    const { payment } = state;
    if (payment.payment === "paypal") {
      if (!payment.email || !validator.isEmail(payment.email)) {
        errors.email = "Please provide a valid email";
      }
      return errors;
    } else if (payment.payment === "visa") {
      if (
        !payment.cardnumber ||
        !validator.isNumeric(payment.cardnumber) ||
        !validator.isLength(payment.cardnumber, { max: 19, min: 13 })
      ) {
        errors.cardnumber = "Please enter a valid card number";
      }
      if (
        !payment.expirationdate ||
        new Date(payment.expirationdate) === "Invalid Date" ||
        isNaN(new Date(payment.expirationdate))
      ) {
        errors.expirationdate = "Please provide a valid date";
      }
      if (
        !payment.securitycode ||
        !validator.isNumeric(payment.securitycode) ||
        !validator.isLength(payment.securitycode, { max: 4, min: 3 })
      ) {
        errors.securitycode = "Please provide a valid security code";
      }
      return errors;
    }
  };

  changePaymentType = (payment) => {
    if (this.state.payment.payment === payment.name) return;
    if (this.state.payment.id) return;
    if (payment.name === "visa") {
      this.setState({
        payment: {
          payment: "visa",
          cardnumber: "",
          expirationdate: new Date(),
          securitycode: "",
        },
      });
    } else if (payment.name === "paypal") {
      this.setState({
        payment: {
          payment: "paypal",
          email: "",
        },
      });
    }
  };

  onChange = (e) => {
    this.setState({
      payment: {
        ...this.state.payment,
        [e.target.name]: e.target.value,
      },
    });
  };

  onDateChange = (date) => {
    console.log(date.toISOString());
    this.setState({
      payment: {
        ...this.state.payment,
        expirationdate: date,
      },
    });
  };

  state = {
    loading: false,
    payment: {
      payment: "",
    },
    errors: {},
  };

  valid_payments = [
    {
      title: "Credit/Debit Card",
      name: "visa",
    },
    {
      title: "PayPal",
      name: "paypal",
    },
  ];

  render() {
    const { payment, errors } = this.state;
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div className="container">
          <div className="w-100 text-default-black display-4 pt-5">Payment</div>
          <div className="w-100 text-default-black h3 pb-5">
            {payment.id ? "Edit Payment Method" : "Add Payment Method"}
          </div>
          <div className="w-100">
            <div className="col-12 col-md-7 col-xl-5 p-0">
              <div className="d-flex flex-wrap justify-content-sm-between justify-content-around">
                {this.valid_payments.map((onepayment) => (
                  <button
                    onClick={() => {
                      this.changePaymentType(onepayment);
                    }}
                    style={{ width: "150px" }}
                    className={
                      payment.payment === onepayment.name
                        ? "btn rounder btn-outline-pink mx-1 mt-1 mt-sm-0"
                        : "btn rounder btn-outline-secondary mx-1 mt-1 mt-sm-0"
                    }
                  >
                    {onepayment.title}
                  </button>
                ))}
              </div>
              {payment.payment === "paypal" ? (
                <div className="pt-5">
                  <label className="text-pink ml-2 font-weight-bold">
                    PayPal Email
                  </label>
                  <div className="d-flex p-0">
                    <input
                      name="email"
                      value={payment.email}
                      onChange={this.onChange}
                      type="text"
                      className="m-0 form-control form-control-lg rounder"
                      placeholder="Enter Email"
                    />
                    <img
                      alt="..."
                      className="d-none d-sm-block ml-1"
                      style={{ height: "3rem" }}
                      src={process.env.PUBLIC_URL + "/paypal-icon.svg"}
                    />
                  </div>

                  <div className="w-100 text-danger text-center">
                    <small>{errors.email}</small>
                  </div>
                </div>
              ) : (
                payment.payment === "visa" && (
                  <div className="pt-5">
                    <label className="text-pink ml-2 font-weight-bold">
                      Card Number
                    </label>
                    <div className="d-flex p-0">
                      <input
                        value={payment.cardnumber}
                        onChange={this.onChange}
                        name="cardnumber"
                        maxLength={19}
                        minLength={13}
                        type="text"
                        className="m-0 form-control form-control-lg rounder"
                        placeholder="Number"
                      />
                      <img
                        alt="..."
                        className="d-none d-sm-block ml-1"
                        style={{ height: "3rem" }}
                        src={process.env.PUBLIC_URL + "/visa-icon.svg"}
                      />
                    </div>
                    <div className="w-100 text-danger text-center">
                      <small>{errors.cardnumber}</small>
                    </div>
                    <div className="mt-4 flex-fill d-flex justify-content-between flex-wrap">
                      <div className="col-lg-5 col-sm-6 col-12 p-0">
                        <label className="text-pink font-weight-bold ml-2">
                          Expiration
                        </label>
                        <div>
                          <DatePicker
                            dateFormat="MM/yy"
                            placeholder="MM/YY"
                            className="form-control form-control-lg rounder"
                            showMonthYearPicker
                            selected={payment.expirationdate}
                            onChange={this.onDateChange}
                          />
                        </div>

                        <div className="w-100 text-danger text-center">
                          <small>{errors.expirationdate}</small>
                        </div>
                      </div>
                      <div className="col-lg-5 col-sm-6 col-12 p-0">
                        <label className="text-pink font-weight-bold ml-2">
                          Security Code
                        </label>
                        <input
                          value={payment.securitycode}
                          onChange={this.onChange}
                          type="text"
                          placeholder="000"
                          name="securitycode"
                          className="form-control form-control-lg rounder"
                        />

                        <div className="w-100 text-danger text-center">
                          <small>{errors.securitycode}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
              {payment.payment && (
                <div className="pt-5 w-100 text-center">
                  <button
                    onClick={this.onSubmit}
                    className="btn font-weight-bold btn-outline-pink rounder col-10 col-sm-4"
                  >
                    {payment.id ? "Save" : "Add"}
                  </button>
                </div>
              )}
              <div className="py-5 w-100 text-center">
                <Link to="/user/payment/" className="text-pink alert-link">
                  Already added a payment method?
                </Link>
              </div>
            </div>
          </div>
        </div>
        <FooterComponent></FooterComponent>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPaymentComponent);

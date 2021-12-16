import React, { Component } from "react";
import { connect } from "react-redux";
import HeaderComponent from "./header.component";
import FooterComponent from "./footer.component";
import LoadingPageComponent from "./loadingPage.component";
import { Link } from "react-router-dom";
import APIService from "../services/apiRequest.service";

class PaymentComponent extends Component {
  async componentDidMount() {
    await APIService.fetchUser().then((res) => {
      this.setState({ user: res.data });
    });
    this.fetch();
  }

  fetch = () => {
    this.setState({ loading: true });
    APIService.fetchPayments({ user: this.state.user.id }).then((res) => {
      this.setState({
        methods: res.data,
        loading: false,
      });
    });
  };

  deletePayment = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ loading: true });
    APIService.deletePayment({ id: id })
      .then((res) => {
        this.setState({
          methods: this.state.methods.filter((x) => {
            return x.id !== id;
          }),
          loading: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loading: false,
        });
      });
  };

  state = {
    methods: [],
    user: {},
    loading: false,
  };

  render() {
    const { methods, loading } = this.state;
    console.log(methods);
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div className="container">
          {loading && <LoadingPageComponent></LoadingPageComponent>}
          <div className="w-100 text-default-black display-4 py-5">Payment</div>
          {!loading &&
            methods.map((method) => (
              <div className="w-100 my-4 text-left">
                <div className="col-12 col-md-8 col-lg-4 rounder shadow">
                  <Link
                    to={{
                      pathname: "/user/payment/edit",
                      state: { payment: method },
                    }}
                    className="py-2 solid-link d-flex justify-content-between align-items-center"
                  >
                    <img
                      height={35}
                      alt={method.payment}
                      src={
                        process.env.PUBLIC_URL +
                        "/" +
                        method.payment +
                        "-icon.svg"
                      }
                    />
                    {method.payment === "visa" && (
                      <span className="font-weight-bold text-muted flex-fill ml-sm-4 ml-2">
                        {".... " +
                          ("000" + (method.cardnumber % 10000)).slice(-4)}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        this.deletePayment(e, method.id);
                      }}
                      className="rounded-circle btn-solid-link bg-white px-2 text-muted btn-lg"
                    >
                      <i className="fa fa-trash-o"></i>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          {!loading && methods.length === 0 && (
            <div className="w-100 text-muted ml-4">No Payments Registered</div>
          )}
          <div className="w-100 py-5">
            <Link
              className="btn-solid-link lead alert-link text-pink"
              to="/user/payment/add"
            >
              Add Payment Method
            </Link>
          </div>
        </div>
        <FooterComponent></FooterComponent>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentComponent);

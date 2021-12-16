import React, { Component } from "react";
import { connect } from "react-redux";
import HeaderComponent from "./header.component";
import FooterComponent from "./footer.component";
import LoadingPageComponent from "./loadingPage.component";
import { Link } from "react-router-dom";
import validator from "validator";
import APIService from "../services/apiRequest.service";

class BalanceComponent extends Component {
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
        balance: 6,
        loading: false,
      });
      //   APIService.fetchBalance()
    });
  };
  state = {
    loading: false,
    balance: 0,
    amount: "",
    methods: [],
    error: "",
  };

  withdraw = (method) => {
    this.setState({ error: null });

    let error = this.validate(this.state);
    if (error) {
      console.log(error);
      this.setState({ error: error });

      return;
    }
    //do the transaction
    let success = true;
    this.props.history.push({
      pathname: "/user/payment/after",
      state: success,
    });
  };

  onChange = (e) => {
    this.setState({
      amount: e.target.value,
    });
  };

  validate = (state) => {
    let minimum_transaction = 1;
    if (!state.amount) {
      return "Please enter a valid amount";
    }
    if (!validator.isNumeric(state.amount)) {
      return "Amount must be in digits only";
    }
    if (state.balance < 1) {
      return "You do not have enough balance to withdraw";
    }
    if (state.amount < minimum_transaction) {
      return "Minimum Valid Transaction is $" + minimum_transaction;
    }
    if (state.amount > state.balance) {
      return "Amount must be less than or equal to balance";
    }
    return null;
  };

  render() {
    const { loading, balance, amount, methods } = this.state;
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div className="container">
          {loading && <LoadingPageComponent></LoadingPageComponent>}
          <div className="d-none d-md-block">
            <div className="w-100 text-default-black display-4 pt-5">
              Balance
            </div>
            <div className="display-1 text-pink font-weight-bold pt-2">
              {"$" + balance}
            </div>
          </div>
          <div className="d-none d-block d-md-none">
            <div className="w-100 text-default-black h1 pt-5">Balance</div>
            <div className="h1 text-pink font-weight-bold pt-2">
              {"$" + balance}
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3 mt-4 p-0">
            <input
              value={amount}
              onChange={this.onChange}
              name="amount"
              className="form-control form-control-lg rounder"
              placeholder="Enter Amount"
            ></input>
            <div className="w-100 text-center text-danger">
              <small>{this.state.error}</small>
            </div>
          </div>
          <div className="text-pink h3 mt-5">Withdraw to</div>
          <div className="text-pink lead">Credit/Debit Card</div>
          <div>
            {!loading &&
              methods.map(
                (method) =>
                  method.payment === "visa" && (
                    <div className="w-100 my-4 text-left">
                      <button className="col-12 col-md-8 col-lg-4 rounder shadow text-left py-1 px-3 btn-solid-link">
                        <div
                          onClick={() => {
                            this.withdraw(method);
                          }}
                          className="py-2 solid-link d-flex justify-content-left align-items-center"
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
                        </div>
                      </button>
                    </div>
                  )
              )}
          </div>
          <div className="text-pink lead">PayPal</div>
          <div>
            {!loading &&
              methods.map(
                (method) =>
                  method.payment === "paypal" && (
                    <div className="w-100 my-4 text-left">
                      <button className="col-12 col-md-8 col-lg-4 rounder shadow text-left py-1 px-3 btn-solid-link">
                        <div
                          onClick={() => {
                            this.withdraw(method);
                          }}
                          className="py-2 solid-link d-flex justify-content-left align-items-center"
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
                          {method.type === "visa" && (
                            <span className="font-weight-bold text-muted flex-fill ml-sm-4 ml-2">
                              {".... " +
                                ("000" + (method.cardnumber % 10000)).slice(-4)}
                            </span>
                          )}
                        </div>
                      </button>
                    </div>
                  )
              )}
          </div>
          <div className="col-12 col-md-4 my-5">
            <Link
              to="/user/payment"
              className="solid-link alert-link lead text-pink d-flex align-items-center"
            >
              <i className="fa fa-arrow-left pr-2"></i>
              <span>Back to Payments</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(BalanceComponent);

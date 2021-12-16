import React, { Component } from "react";
import { connect } from "react-redux";
import HeaderComponent from "./header.component";
import FooterComponent from "./footer.component";

class TransactionResultComponent extends Component {
  state = {
    loading: true,
    status: undefined,
  };
  componentDidMount() {
    if (!this.props.location.state) {
      this.props.history.push("/home");
    }
    this.setState({
      status: this.props.location.state,
      loading: false,
    });
  }
  render() {
    const { status } = this.state;
    return (
      <div className="text-center">
        <HeaderComponent></HeaderComponent>
        <div style={{ height: "60vh" }}>
          {status ? (
            <div
              style={{
                position: "absolute",
                top: "30%",
                left: "0%",
                right: "0%",
                bottom: "60%",
              }}
            >
              <img
                alt="..."
                style={{
                  width: "25%",
                  maxWidth: "200px",
                }}
                src={process.env.PUBLIC_URL + "/check-icon.svg"}
              />
              <div className="mt-2 text-pink h2 font-weight-bold">
                Transaction Successful
              </div>
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                top: "30%",
                left: "0%",
                right: "0%",
                bottom: "60%",
              }}
            >
              <img
                alt="..."
                style={{
                  width: "25%",
                  maxWidth: "200px",
                }}
                src={process.env.PUBLIC_URL + "/cross-icon.svg"}
              />
              <div className="mt-2 text-pink h2 font-weight-bold">
                Transaction Failed
              </div>
            </div>
          )}
        </div>
        <div className="text-sm-right text-center pr-sm-5 pb-5">
          <button
            onClick={() => {
              this.props.history.goBack();
            }}
            to="/payment/balance"
            className="text-pink btn-solid-link alert-link h4"
          >
            Go back
          </button>
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
)(TransactionResultComponent);

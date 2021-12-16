import React, { Component } from "react";
import { connect } from "react-redux";
import HeaderComponent from "./header.component";
import FooterComponent from "./footer.component";
import LoadingPageComponent from "./loadingPage.component";
import { Link } from "react-router-dom";
import APIService from "../services/apiRequest.service";
import StaticData from "./StaticData";
import Loader from "react-loader-spinner";

class InvoiceComponent extends Component {
  async componentDidMount() {
    await APIService.fetchUser().then((res) => {
      this.setState({
        params: {
          ...this.state.params,
          id: res.data.id,
        },
        loading: false,
      });
    });
    this.fetch();
  }

  fetch = () => {
    this.setState({ fetching: true });
    APIService.FetchInvoices(this.state.params).then((res) => {
      this.setState((state) => {
        const results = this.state.results.concat(...res.data);
        console.log(results);
        return {
          results: results,
          fetching: false,
        };
      });

      res.data.length < 24
        ? this.setState({ params: { ...this.state.params, batch: -1 } })
        : this.setState({
            params: {
              ...this.state.params,
              batch: this.state.params.batch + 1,
            },
          });
    });
  };

  getDate = (timestamp) => {
    var date = new Date(timestamp * 1000);
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
  };

  state = {
    loading: true,
    fetching: true,
    params: {
      searchType: "purchase",
      id: undefined,
      batch: 0,
    },
    results: [],
    tab: "Payments",
  };
  tabs = ["Payments", "Withdrawn"];

  changeTab = async (tab) => {
    if (tab === this.state.tab) return;
    await this.setState({
      results: [],
      tab: tab,
      params: {
        ...this.state.params,
        searchType: tab === "Payments" ? "purchase" : "withdraw",
        batch: 0,
      },
    });
    this.fetch();
  };
  render() {
    const { loading, fetching, results, tab } = this.state;
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div className="container">
          {loading && <LoadingPageComponent></LoadingPageComponent>}
          <div className="w-100 text-default-black display-4 pt-5">Invoice</div>

          <div className="w-100 pt-5">
            <ul className="nav justify-content-center">
              {this.tabs.map((onetab) => (
                <li
                  onClick={() => {
                    this.changeTab(onetab);
                  }}
                  className={
                    tab === onetab
                      ? "nav-item lead font-weight-bold text-pink"
                      : "nav-item lead font-weight-bold text-default-black"
                  }
                  style={{ cursor: "pointer" }}
                >
                  <span className="px-5 nav-link">{onetab}</span>
                  {tab === onetab && (
                    <div className="w-100 pt-1 border bg-pink"></div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {tab === "Payments" ? (
            <div className="row pt-5">
              {!fetching && results.length === 0 && (
                <div className="col-12 text-center text-muted">
                  No results to show
                </div>
              )}
              {fetching && (
                <div className="col-12 text-center text-muted">
                  <Loader type="ThreeDots" color="#cd3333" width={50}></Loader>
                </div>
              )}
              {!fetching &&
                results.map((oneitem) => (
                  <div
                    className="card border-0 rounded"
                    style={{ width: "22rem" }}
                  >
                    <img
                      src={StaticData.BEURL + oneitem.course.coverurl}
                      height="200px"
                      className="card-img-top shadow"
                      style={{ borderRadius: "20px" }}
                      alt="..."
                    />
                    <div className="p-1 d-flex justify-content-start align-items-center">
                      <small className="text-pink card-text text-left">
                        {oneitem.course.category}
                      </small>
                    </div>
                    <div className="pt-2 d-flex justify-content-start">
                      <span className="lead text-default-black font-weight-bold card-text text-left">
                        {oneitem.course.title}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-pink lead">
                        {this.getDate(oneitem.timestamp)}
                      </span>

                      <span className="p-0 text-pink font-weight-bold card-text text-right lead">
                        {"$ " + oneitem.amount}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            tab === "Withdrawn" && (
              <div className="w-100 d-flex justify-content-center text-center pt-5">
                {!fetching && results.length === 0 && (
                  <div className="col-12 text-center text-muted">
                    No results to show
                  </div>
                )}
                {fetching && (
                  <div className="col-12 text-center text-muted">
                    <Loader
                      type="ThreeDots"
                      color="#cd3333"
                      width={50}
                    ></Loader>
                  </div>
                )}
                {!fetching &&
                  results.map((oneitem) => (
                    <div className="col-10 my-2 bg-default-grey px-4 py-2 card border-0 rounder">
                      <div className="h3 text-default-black text-left">
                        Withdrawn
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-pink lead">
                          {this.getDate(oneitem.timestamp)}
                        </span>

                        <span className="p-0 pt-5 text-pink font-weight-bold card-text text-right lead">
                          {"$ " + oneitem.amount}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )
          )}
          {!fetching && this.state.params.batch > 0 && (
            <div className="w-100 text-center">
              <button className="btn-solid-link alert-link text-pink">
                Load More
              </button>
            </div>
          )}
          {!fetching && this.state.params.batch < 0 && (
            <div className="w-100 text-center text-muted">End of Results</div>
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceComponent);

import React, { Component } from "react";
import { connect } from "react-redux";
import HeaderComponent from "./header.component";
import FooterComponent from "./footer.component";
import LoadingPageComponent from "./loadingPage.component";
import APIService from "../services/apiRequest.service";
import { Link } from "react-router-dom";

class HelpComponent extends Component {
  componentDidMount() {
    this.fetch();
  }
  state = {
    loading: false,
    params: {},
    search: "",
    results: [],
    faqs: [],
    topics: [],
    tab: "Student",
  };

  fetch = () => {
    APIService.fetchHelpArticles({ type: this.state.tab.toLowerCase() }).then(
      (res) => {
        this.setState({
          faqs: res.data,
        });
      }
    );
  };

  tabs = ["Student", "Instructor"];

  topics = {
    Instructor: [
      {
        title: "Creating a course",
        icon: "/create-course-icon.svg",
      },
      {
        title: "Course Management",
        icon: "/course-management-icon.svg",
      },
      {
        title: "Instructor Profile",
        icon: "/account-icon.svg",
      },
      {
        title: "Instructor Payment",
        icon: "/payment-icon.svg",
      },
      {
        title: "Quality Standards",
        icon: "/quality-icon.svg",
      },
      {
        title: "Trust & Safety",
        icon: "/trust-icon.svg",
      },
    ],
    Student: [
      {
        title: "Getting Started",
        icon: "/getting-started-icon.svg",
      },
      {
        title: "Course Enrollment",
        icon: "/course-enrollment-icon.svg",
      },
      {
        title: "Account/Profile",
        icon: "/account-icon.svg",
      },
      {
        title: "Payemnt Process",
        icon: "/payment-icon.svg",
      },
      {
        title: "Student's Work",
        icon: "/work-icon.svg",
      },
      {
        title: "Review/Rating",
        icon: "/rating-icon.svg",
      },
    ],
  };

  changeTab = (tab) => {
    this.setState({ tab: tab });
  };

  onefaq = {
    title: "This is a question",
  };

  render() {
    const { loading, faqs, results, tab } = this.state;
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        {loading && <LoadingPageComponent></LoadingPageComponent>}
        <div className="">
          <div className="w-100 bg-pink py-5 text-center">
            <div className="d-none d-md-block display-3 text-white text-center">
              How may we help you?
            </div>
            <div className="d-block d-md-none h2 text-white text-center">
              How may we help you?
            </div>
            <div className="w-100 px-1 pt-4 d-flex justify-content-center text-default-white">
              <div className="col-12 col-sm-8 p-0 m-0">
                <form onSubmit={this.onSubmit} className="text-left">
                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn-solid-link btn-lg text-secondary fa fa-search p-4"
                      style={{
                        position: "absolute",
                        fontSize: "large",
                        textDecoration: "none",
                      }}
                    ></button>
                    <input
                      className="form-control form-control-lg pl-5"
                      style={{ borderRadius: "50px", height: "65px" }}
                      placeholder="Search by Keyword"
                      onChange={this.onChange}
                    />
                  </div>
                </form>
                <div
                  className="text-center d-flex justify-content-center"
                  style={{
                    marginTop: "-30px",
                    zIndex: "10",
                    paddingTop: "40px",
                  }}
                >
                  <div
                    className="dropdown-menu p-0 border border-mute bg-white border-top-0 rounded-bottom"
                    data-display="static"
                    style={{
                      marginTop: "-26px",
                      marginInline: "7.5%",
                      display:
                        loading || !this.state.results.length
                          ? "none"
                          : "block",
                      width: "85%",
                    }}
                  >
                    {results.map((result) => (
                      <button
                        className="btn-lg col-12 py-2 d-flex justify-content-left dropdown-item px-4 text-default-black text-truncate"
                        onClick={(e) => {
                          this.onClickSuggestion(e, "Workshop", result.title);
                        }}
                      >
                        <div className="text-left mr-4">
                          <i className="fa fa-book"></i>
                        </div>
                        <div className="text-left result">{result.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-100">
            <ul className="nav justify-content-center">
              {this.tabs.map((onetab) => (
                <li
                  onClick={() => {
                    this.changeTab(onetab);
                  }}
                  className={
                    tab === onetab
                      ? "nav-item lead font-weight-bold text-pink"
                      : "nav-item lead font-weight-bold"
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
          <div className="w-100 d-flex justify-content-center">
            <div className="col-lg-10 col-12 pt-5 h4 ">
              <div className="d-flex text-muted align-items-center">
                <i className="fa fa-question mr-2"></i>
                <span>Frequently Asked Questions</span>
              </div>
            </div>
          </div>
          <div className="w-100 d-flex justify-content-center">
            <div className="col-lg-10 col-12 d-flex flex-wrap justify-content-center pt-5 h4 ">
              {faqs.map((onefaq) => (
                <div className="col-12 col-sm-6 col-md-4 p-2">
                  <Link
                    className="btn-solid-link text-default-black"
                    to={"/help/article/" + onefaq.id}
                  >
                    <div className="bg-default-grey rounder p-4 text-center">
                      {onefaq.title}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="w-100 d-flex justify-content-center">
            <div className="col-lg-10 col-12 pt-5 h4 ">
              <div className="text-muted">
                <span>Topics you want to search for</span>
              </div>
            </div>
          </div>
          <div className="w-100 d-flex justify-content-center">
            <div className="col-lg-10 col-12 d-flex flex-wrap justify-content-center pt-5 h4 ">
              {this.topics[tab].map((onetopic) => (
                <div className="col-12 col-sm-6 col-md-4 p-2">
                  <Link
                    className="btn-solid-link text-default-black"
                    to={{
                      pathname: "/help/topic",
                      state: {
                        topic: onetopic.title,
                        type: tab.toLowerCase(),
                      },
                    }}
                  >
                    <div className="bg-default-white border border muted rounder p-4 text-center">
                      <img
                        alt="..."
                        height={80}
                        src={process.env.PUBLIC_URL + onetopic.icon}
                      />
                      <div className="h4 mt-3">{onetopic.title}</div>
                    </div>
                  </Link>
                </div>
              ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(HelpComponent);

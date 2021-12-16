import React, { Component } from "react";
import { connect } from "react-redux";
import CourseCard from "./courseCard.component";
import FooterComponent from "./footer.component";
import HeaderComponent from "./header.component";
import ShareDialog from "./shareDialog.component";
import Loader from "react-loader-spinner";
import LoadingPageComponent from "./loadingPage.component";
import APIService from "../services/apiRequest.service";
import DiscussionComponent from "./discussion.component";
import { Link } from "react-router-dom";
import StaticData from "./StaticData";

class CourseManagementComponent extends Component {
  async componentDidMount() {
    await APIService.fetchUser().then((res) => {
      this.setState({ user: res.data });
      this.setState({
        params: {
          ...this.state.params,
          selfid: res.data.id,
          searchValue: res.data.username,
        },
      });
    });
    this.fetch();
  }

  fetch = () => {
    this.setState({ loading: true });
    APIService.fetchWorkshops(this.state.params).then((res) => {
      this.setState((state) => {
        const results = this.state.results.concat(...res.data);

        return {
          results: results,
          loading: false,
          fetching: false,
          changed: false,
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

  shareLink = (link) => {
    if (link) {
      this.setState({
        shareDialog: {
          display: true,
          link: link,
        },
      });
    }
    document.onkeyup = (e) => {
      if (e.key === "Escape") {
        this.setState({
          shareDialog: {
            display: false,
            link: "",
          },
        });
        document.onkeyup = null;
      }
    };
  };

  loadDiscussion = (workshop) => {
    this.setState({
      discussion: {
        workshop: workshop,
      },
    });
  };

  unloadDiscussion = () => {
    this.setState({
      discussion: undefined,
    });
  };

  state = {
    loading: true,
    title: "",
    params: {
      searchType: "Author",
      searchValue: undefined,
      selfid: undefined,
      batch: 0,
    },
    results: [],
    shareDialog: { display: false, link: "" },
    tab: "Courses",
    discussion: undefined,
  };

  tabs = ["Courses", "Discussion"];

  changeTab = (tab) => {
    this.setState({ tab: tab });
  };

  oneItem = {
    id: "001",
    imageUrl: process.env.PUBLIC_URL + "/clock-icon.svg",
    category: "Graphic Design",
    title: "Gift Card Workshop",
    authorId: "004",
    author: "Ryoko",
    rating: 5.0,
    price: 16.55,
    enrolled: 14,
    sold: 12,
    view: "general",
  };

  render() {
    const { loading, results, shareDialog, tab, discussion } = this.state;
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div>
          {shareDialog.display && (
            <ShareDialog link={shareDialog.link}></ShareDialog>
          )}
        </div>
        <div className="mt-5">
          {loading && <LoadingPageComponent></LoadingPageComponent>}
          <div className="h1 w-100 text-left p-md-5 p-1">
            Manage Your Courses
          </div>
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
          {tab === "Courses" ? (
            <div className="pt-5">
              <div className="px-md-5 d-flex justify-content-between">
                <div className="h4">Your Courses</div>
                <Link
                  to="/create-workshop"
                  className="alert-link btn-solid-link text-default-black lead"
                >
                  <span>Add new course</span>
                  <i className="fa fa-plus text-pink ml-2"></i>
                </Link>
              </div>
              <div className="row m-0 pt-2">
                {!this.state.fetching && results.length === 0 && (
                  <div className="w-100 text-muted text-center">
                    No results to show
                  </div>
                )}
                {!loading &&
                  results.map((result) => (
                    <div className="col-12 col-xl-4 col-md-6 my-2 d-flex justify-content-center">
                      <CourseCard
                        shareLink={this.shareLink}
                        oneitem={result}
                        toggleFavorite={this.toggleFavorite}
                      ></CourseCard>
                    </div>
                  ))}
              </div>
              <div className="d-flex justify-content-center my-5">
                {this.state.fetching && (
                  <div className="w-100 text-center">
                    <Loader
                      type="ThreeDots"
                      color="#cd3333"
                      width={80}
                    ></Loader>
                  </div>
                )}
                {this.state.params.batch < 0 && (
                  <div className="w-100 text-muted text-center">
                    End of Results
                  </div>
                )}
                {!this.state.fetching && this.state.params.batch !== -1 && (
                  <button
                    className="btn btn-solid-link font-weight-bold text-pink btn-lg"
                    onClick={this.fetch}
                  >
                    Load More
                  </button>
                )}
              </div>
            </div>
          ) : tab === "Discussion" && !discussion ? (
            <div className="pt-5">
              <div className="px-md-5">
                <div className="h3">Conversation with Students</div>

                <div className="lead">
                  Find discussion related to each topic
                </div>
              </div>
              <div className="row m-0 py-2">
                {results.map((oneitem) => (
                  <div className="col-12 col-xl-4 col-md-6 my-2 d-flex justify-content-center">
                    <button
                      onClick={() => this.loadDiscussion(oneitem)}
                      className="btn btn-link solid-link"
                    >
                      <div
                        className="card border-0 rounder"
                        style={{ width: "22rem" }}
                      >
                        <img
                          src={StaticData.BEURL + oneitem.imageUrl}
                          height="200px"
                          className="card-img-top shadow rounder"
                          alt="..."
                        />
                        <div className="p-1 text-left">
                          <small className="text-pink card-text text-left">
                            {oneitem.category}
                          </small>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="lead text-default-black font-weight-bold card-text text-left">
                            {oneitem.title}
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-center my-5">
                {this.state.fetching && (
                  <div className="w-100 text-center">
                    <Loader
                      type="ThreeDots"
                      color="#cd3333"
                      width={80}
                    ></Loader>
                  </div>
                )}
                {this.state.params.batch < 0 && (
                  <div className="w-100 text-muted text-center">
                    End of Results
                  </div>
                )}
                {!this.state.fetching && this.state.params.batch !== -1 && (
                  <button
                    className="btn btn-solid-link font-weight-bold text-pink btn-lg"
                    onClick={this.fetch}
                  >
                    Load More
                  </button>
                )}
              </div>{" "}
            </div>
          ) : (
            tab === "Discussion" &&
            discussion && (
              <div className="p-5 text-default-black">
                <div className="d-flex justify-content-start align-items-center">
                  <button
                    onClick={this.unloadDiscussion}
                    className="btn-solid-link bg-white rounded-circle"
                    style={{ width: "50px", height: "50px" }}
                  >
                    <i className="fa fa-arrow-left text-default-black lead"></i>
                  </button>
                  <span className="ml-1 font-weight-bold">Back To List</span>
                </div>
                <div className="px-5 h1 font-weight-bold">
                  {discussion.workshop.title}
                </div>
                <div className="px-5 lead font-weight-bold">
                  Discussion Thread
                </div>
                <DiscussionComponent
                  id={discussion.workshop.id}
                  selfid={this.state.params.selfid}
                ></DiscussionComponent>
              </div>
            )
          )}
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
)(CourseManagementComponent);

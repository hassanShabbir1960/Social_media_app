import React from "react";
import { Link } from "react-router-dom";
import FooterComponent from "./footer.component";
import HeaderComponent from "./header.component";
import { connect } from "react-redux";
import APIService from "../services/apiRequest.service";
import CourseCard from "./courseCard.component";
import PostPanel from "./postPanel.component";
import validator from "validator";
import StaticData from "./StaticData";
import ShareDialog from "./shareDialog.component";

class ProfileComponent extends React.Component {
  async componentDidMount() {
    await APIService.fetchUser()
      .then((res) => {
        this.setState({
          selfuser: res.data,
          params: {
            ...this.state.params,
            selfid: res.data.id,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });

    var id = this.props.match.params.id;
    if (!id || !validator.isNumeric(id.toString()) || parseInt(id) < 0) {
      this.props.history.push("/404");
      return;
    }
    await APIService.fetchUserDetails(id)
      .then((res) => {
        this.setState({
          userDetails: res.data.user_details,
        });
        this.setState({
          userDetails: {
            ...this.state.userDetails,
            username: res.data.user.username,
            email: res.data.user.email,
          },
          params: {
            ...this.state.params,
            searchValue: res.data.user.username,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        this.props.history.push("/404");
        return;
      });
  }

  fetch = (what) => {
    if (what === "Courses") {
      this.setState({ loading: true });
      APIService.fetchWorkshops(this.state.params).then((res) => {
        this.setState((state) => {
          const courses = this.state.courses.concat(...res.data);

          return {
            courses: courses,
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
    }
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

  toggleFavorite = (workshopID) => {
    APIService.ToggleFavorites(this.state.params.selfid, workshopID).then(
      (res) => {
        this.setState((state) => {
          var results = [...state.results];
          var index = results.findIndex((w) => w.id === workshopID);
          results[index].favorite = res.data.status;
          return {
            results: [...results],
          };
        });
      }
    );
  };

  state = {
    // PROFILE_IMAGE_PATH : "../../../donow_backend/",
    tab: "",
    loading: false,
    courses: [],
    selfuser: {},
    userDetails: {},
    params: {
      searchType: "Author",
      searchValue: undefined,
      selfid: undefined,
      batch: 0,
    },
    shareDialog: { display: false, link: "" },
  };

  changeTab = (tab) => {
    if (tab === this.state.tab) return;
    this.setState({ tab: tab });
    if (!this.state.courses.length) this.fetch(tab);
  };

  tabs = ["Posts", "Courses"];

  render() {
    const {
      loading,
      userDetails,
      selfuser,
      tab,
      courses,
      shareDialog,
    } = this.state;

    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div>
          {shareDialog.display && (
            <ShareDialog link={shareDialog.link}></ShareDialog>
          )}
        </div>

        <div className="container-fluid mt-5">
          <div className="row">
            <div className="col-md-1 col"></div>
            <div className="col-lg-2 col-md-3 col-12 text-center">
              <img
                alt="profile"
                src={
                  userDetails.profile_image
                    ? StaticData.BEURL + userDetails.profile_image
                    : process.env.PUBLIC_URL + "/user-icon.svg"
                }
                width="130px"
                height="130px"
                className="rounded-circle border border-mute"
              ></img>
              <hr className="bg-secondary" style={{ width: "120px" }}></hr>

              <div className="my-1">
                {userDetails.instagram_profile && (
                  <a
                    href={userDetails.instagram_profile}
                    target='_blank'
                    className="text-dark mx-1"
                  >
                    <i className="fa fa-instagram"></i>
                  </a>
                )}
                {userDetails.youtube_profile && (
                  <a
                    href={userDetails.youtube_profile}
                    target='_blank'
                    className="text-dark mx-1"
                  >
                    <i className="fa fa-youtube"></i>
                  </a>
                )}
                {userDetails.twitter_profile && (
                  <a
                    href={userDetails.twitter_profile}
                    target='_blank'
                    className="text-dark mx-1"
                  >
                    <i className="fa fa-twitter"></i>
                  </a>
                )}
                {userDetails.facebook_profile && (
                  <a
                    href={userDetails.facebook_profile}
                    target='_blank'
                    className="text-dark mx-1"
                  >
                    <i className="fa fa-facebook"></i>
                  </a>
                )}
                {userDetails.pinterest_profile && (
                  <a
                    href={userDetails.pinterest_profile}
                    target='_blank'
                    className="text-dark mx-1"
                  ></a>
                )}
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-12 text-default-black text-left">
              <span className="d-flex justify-content-between">
                <strong className="h3">
                  {this.state.userDetails.first_name}{" "}
                  {this.state.userDetails.last_name}
                </strong>
                {userDetails.user === selfuser.id ? (
                  <Link
                    to="/edit-profile"
                    className="btn btn-outline-pink btn-sm px-4 mb-2 mr-1 rounded"
                  >
                    Edit Profile
                  </Link>
                ) : !this.state.userDetails.followed ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      APIService.ToggleFollow(userDetails.user)
                      this.componentDidMount()
                    }}
                    className="btn-outline-pink solid-link btn-sm rounder d-flex justify-content-around"
                  >
                    <span>
                      <i className="fa fa-plus"></i>
                    </span>
                    <span className="ml-1">Follow</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      APIService.ToggleFollow(userDetails.user)
                      this.componentDidMount()
                    }}
                    className="btn-outline-pink solid-link btn-sm rounder d-flex justify-content-around"
                  >
                    <span className="ml-1">Unfollow</span>
                  </button>
                )}
              </span>
              <h4>{"@" + this.state.userDetails.username}</h4>
              <strong>
                <span className="mr-3">
                  <span className="text-pink">{this.state.userDetails.posts}</span> Posts
                </span>
                <div className="w-10 d-block d-sm-none"></div>
                <span className="mr-3">
                  <span className="text-pink">{this.state.userDetails.followers}</span> Followers
                </span>
                <div className="w-10 d-block d-sm-none"></div>
                <span className="mr-3">
                  <span className="text-pink">{this.state.userDetails.following}</span> Following
                </span>
              </strong>
              <div className="w-100 mt-4">
                <strong>{this.state.userDetails.bio}</strong>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col p-0">
              <ul className="nav justify-content-around">
                {this.tabs.map((onetab) => (
                  <li
                    onClick={() => {
                      this.changeTab(onetab);
                    }}
                    className={
                      tab === onetab
                        ? "nav-item lead font-weight-bold text-pink flex-fill text-center"
                        : "nav-item lead font-weight-bold flex-fill text-center text-muted"
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <span className="px-5 nav-link">{onetab}</span>
                    {tab === onetab ? (
                      <div className="w-100 pt-1 border bg-pink"></div>
                    ) : (
                      <div className="w-100 pt-1 border bg-grey"></div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {tab === "Courses" && (
            <div className="row m-0 py-5">
              {!this.state.fetching && courses.length === 0 && (
                <div className="w-100 text-muted text-center">
                  No results to show
                </div>
              )}
              {!loading &&
                courses.map((result) => (
                  <div className="col-12 col-xl-4 col-md-6 my-2 d-flex justify-content-center">
                    <CourseCard
                      shareLink={this.shareLink}
                      oneitem={result}
                      toggleFavorite={this.toggleFavorite}
                    ></CourseCard>
                  </div>
                ))}
            </div>
          )}
          {tab === "Posts" && (
            <PostPanel
              type={"User"}
              id={userDetails.user}
              selfid={selfuser.id}
            ></PostPanel>
          )}
        </div>
        {!tab && <div style={{ paddingTop: "20%" }}></div>}
        <FooterComponent></FooterComponent>
      </div>
    );
  }
}

export default connect(null, null)(ProfileComponent);

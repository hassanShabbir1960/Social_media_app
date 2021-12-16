import React, { Component } from "react";
import { connect } from "react-redux";
import CourseCard from "./courseCard.component";
import FooterComponent from "./footer.component";
import HeaderComponent from "./header.component";
import ShareDialog from "./shareDialog.component";
import Loader from "react-loader-spinner";
import LoadingPageComponent from "./loadingPage.component";
import APIService from "../services/apiRequest.service";

class CoursePanel extends Component {
  async componentDidMount() {
    var title_index = this.valid_locations.indexOf(
      this.props.match.params.location
    );
    if (title_index >= 0) {
      this.setState({
        title: this.valid_titles[title_index],
      });
    } else {
      this.props.history.push("/404");
      return;
    }
    await this.setState({
      type: this.props.type,
    });
    await APIService.fetchUser().then((res) => {
      this.setState({ user: res.data });
      this.setState({
        params: { ...this.state.params, selfid: res.data.id },
      });
    });
    this.fetch();
    // this.setState({ loading: false });
  }

  valid_locations = ["favorites", "purchases"];
  valid_titles = ["My Favorites", "Purchased Courses"];

  fetch = () => {
    if (!this.fetcher) {
      if (this.state.title === this.valid_titles[0]) {
        this.fetcher = APIService.fetchFavorites;
      } else {
        this.fetcher = APIService.fetchPurchased;
      }
    }
    console.log(this.fetcher);
    this.setState({ fetching: true });

    this.fetcher(this.state.params).then((res) => {
      this.setState((state) => {
        const results = this.state.results.concat(...res.data);

        return {
          results: results,
          loading: false,
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

  fetcher = undefined;

  state = {
    loading: true,
    title: "",
    params: {
      selfid: undefined,
      batch: 0,
    },
    results: [],
    shareDialog: { display: false, link: "" },
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
    const { loading, results, shareDialog } = this.state;
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

          <div className="mb-5 pl-sm-5 d-flex justify-content-center justify-content-sm-start align-items-center">
            <div className="display-4">{this.state.title}</div>
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
                <Loader type="ThreeDots" color="#cd3333" width={80}></Loader>
              </div>
            )}
            {this.state.params.batch < 0 && (
              <div className="w-100 text-muted text-center">End of Results</div>
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
        <FooterComponent></FooterComponent>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CoursePanel);

import React, { Component } from "react";
import { connect } from "react-redux";
import FooterComponent from "./footer.component";
import HeaderComponent from "./header.component";
import Loader from "react-loader-spinner";
import APIService from "../services/apiRequest.service";
import { Link } from "react-router-dom";
import CreatorCard from "./CreatorCard.component";

class DiscoverCreatorsComponent extends Component {
  async componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    this.setState({ fetching: true });
    APIService.fetchCreators(this.state.params).then((res) => {
      this.setState((state) => {
        const results = state.changed
          ? [...res.data]
          : this.state.results.concat(...res.data);

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

  onChange = (e) => {
    this.setState({
      params: { ...this.state.params, [e.target.name]: e.target.value },
      changed: true,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.changed) this.fetch();
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

  toggleFollow = (creatorID) => {
    APIService.ToggleFollow(creatorID).then((res) => {
      this.setState((state) => {
        var results = [...state.results];
        var index = results.findIndex((w) => w.id === creatorID);
        results[index].favorite = res.data.status;
        return {
          results: [...results],
        };
      });
    });
  };

  state = {
    loading: true,
    fetching: true,
    params: {
      searchValue: "",
      batch: 0,
    },
    results: [],
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
    const { loading, results } = this.state;
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div className="mt-5">
          <div className="text-sm-left text-center pl-sm-5 mb-3">
            <span>{"DoNow > "}</span>
            <Link className="text-pink" to="/discover">
              Discover
            </Link>
            <span>{" > "}</span>
            <Link className="text-pink" to="/discover/creators">
              Creators
            </Link>
          </div>
          <div className="display-4 text-sm-left text-center pl-sm-5 mb-5">
            Creators
          </div>
          <div className="mb-5 d-flex justify-content-center">
            <form
              onSubmit={this.onSubmit}
              className="d-sm-flex d-block justify-content-center col-xl-9 col-lg-10 col-11"
            >
              <div className="form-group col-sm-8 col-12">
                <button
                  type="submit"
                  className="btn-solid-link text-secondary fa fa-search p-4"
                  style={{
                    position: "absolute",
                    fontSize: "large",
                    textDecoration: "none",
                  }}
                ></button>
                <input
                  name="searchValue"
                  className="form-control form-control-lg pl-5"
                  style={{ borderRadius: "50px", height: "65px" }}
                  placeholder="Search for Creators"
                  onChange={this.onChange}
                />
              </div>
            </form>
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
                  <CreatorCard oneitem={result}></CreatorCard>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverCreatorsComponent);

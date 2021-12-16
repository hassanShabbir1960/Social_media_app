import React, { Component } from "react";
import { connect } from "react-redux";
import Mark from "mark.js";
import APIService from "../services/apiRequest.service";
import HeaderComponent from "./header.component";
import FooterComponent from "./footer.component";
import { Link } from "react-router-dom";

class DiscoverComponent extends Component {
  state = {
    loading: false,
    search: "",
    results: [[], []],
  };

  categories = [
    "Graphic Designing",
    "Rangoli Art",
    "Gift Tutorials",
    "Paper Quiling",
    "Home Decorations",
    "Origami Ideas",
    "Nail Art",
    "Paper Origami Crafts",
    "Greetings Cards",
    "Scrapbook Ideas",
    "Gift Box Ideas",
    "Hair Styling",
    "Recycle Material Ideas",
  ];
  searchMarker = new Mark(".result");

  onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.search)
      this.props.history.push({
        pathname: "/search",
        state: {
          searchType: "String",
          searchValue: this.state.search,
        },
      });
  };

  onChange = (e) => {
    e.persist();
    this.setState({ loading: true, search: e.target.value, results: [[], []] });
    this.searchMarker.unmark();
    //implement your fetch logic for browse by search key here
    APIService.fetchSuggestions(e.target.value)
      .then((res) => {
        this.setState({ results: res.data, loading: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onClickCategory = (e) => {
    this.props.history.push({
      pathname: "/search",
      state: {
        searchType: "Category",
        searchValue: e.target.innerText,
      },
    });
  };

  onClickSuggestion = (e, type, value) => {
    this.props.history.push({
      pathname: "/search",
      state: {
        searchType: type,
        searchValue: value,
      },
    });
  };

  render() {
    const { results, search, loading } = this.state;
    if (!loading) {
      this.searchMarker.mark(search, {
        seperateWordSearch: true,
        element: "span",
        className: "font-weight-bold",
        caseSensitive: false,
        exclude: ["span"],
      });
    }
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div
          className="container-fluid bg-default-black"
          style={{ paddingTop: "5%" }}
        >
          <div className="w-100 text-center">
            <div className="text-default-grey">
              <div className="display-1 d-none d-md-block font-weight-bold">
                Discover
              </div>
              <div className="display-3 d-none d-sm-block d-md-none font-weight-bold">
                Discover
              </div>
              <div className="display-4 d-block d-sm-none font-weight-bold">
                Discover
              </div>
            </div>
            <div className="text-default-grey">
              <div className="h2 d-none d-md-block">
                Browse through our creators and workshops
              </div>
              <div className="h4 d-none d-sm-block d-md-none">
                Browse through our creators and workshops
              </div>
              <div className="h5 d-block d-sm-none">
                Browse through our creators and workshops
              </div>
            </div>
          </div>
          <div className="mt-2 d-flex justify-content-center">
            <div className="col-xl-8 col-md-10 col-12 p-0 m-0">
              <form onSubmit={this.onSubmit}>
                <div className="form-group p-4">
                  <button
                    type="submit"
                    className="btn-solid-link text-secondary fa fa-search ml-2 p-2 mt-3"
                    style={{
                      position: "absolute",
                      fontSize: "large",
                      textDecoration: "none",
                    }}
                  ></button>
                  <input
                    className="form-control form-control-lg pl-5"
                    style={{ borderRadius: "50px", paddingBlock: "32px " }}
                    placeholder="Search by Keyword"
                    onChange={this.onChange}
                  />
                </div>
              </form>
              <div
                className="text-center d-flex justify-content-center"
                style={{ marginTop: "-50px", zIndex: "10", paddingTop: "40px" }}
              >
                <div
                  className="mx-4 border border-mute bg-white border-top-0 rounded-bottom"
                  style={{
                    marginTop: "-26px",
                    display:
                      loading ||
                      !(
                        this.state.results[0].length +
                        this.state.results[1].length
                      )
                        ? "none"
                        : "block",
                    width: "85%",
                  }}
                >
                  {results[0].map((result) => (
                    <button
                      className="btn-lg col-12 py-2 d-flex justify-content-left dropdown-item px-4 text-default-black"
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
                  {results[1].map((result) => (
                    <button
                      className="btn-lg col-12 py-2 d-flex justify-content-left dropdown-item px-4 text-default-black"
                      onClick={(e) => {
                        this.onClickSuggestion(e, "Author", result.name);
                      }}
                    >
                      <div className="text-left mr-4">
                        <i className="fa fa-user"></i>
                      </div>
                      <div className="text-left result">
                        {result.name + "'s workshops"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-100 mt-5 px-5 d-sm-flex text-center justify-content-around">
            <Link
              to="/discover/creators"
              className="btn btn-pink rounder btn-lg font-weight-bold"
              style={{ width: "150px", borderRadius: "100%" }}
            >
              Creators
            </Link>
            <div className="w-100 py-2 d-block d-sm-none"></div>
            <Link
              to="/discover/workshops"
              className="btn btn-pink rounder btn-lg font-weight-bold"
              style={{ width: "150px", borderRadius: "100%" }}
            >
              Workshops
            </Link>
            <div className="w-100 py-2 d-block d-sm-none"></div>
            <Link
              to="/discover/sitemap"
              className="btn btn-pink rounder btn-lg font-weight-bold"
              style={{ width: "150px", borderRadius: "100%" }}
            >
              Sitemap
            </Link>
          </div>
          <div style={{ paddingTop: "20%" }}></div>
        </div>
        <FooterComponent></FooterComponent>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverComponent);

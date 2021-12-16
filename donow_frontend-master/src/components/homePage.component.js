import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import FooterComponent from "./footer.component";
import HeaderComponent from "./header.component";
import Mark from "mark.js";
import APIService from "../services/apiRequest.service";
import LoadingPageComponent from "./loadingPage.component";

class HomePageComponent extends Component {
  componentWillMount() {
    APIService.fetchCategories().then((res) => {
      var categories = res.data.map((item) => {
        return item.cateogry_title;
      });
      this.setState({ isFetching: false, categories: [...categories] });
    });
  }

  state = {
    isFetching: true,
    loading: false,
    search: "",
    categories: [],
    results: [[], []],
  };

  searchMarker = new Mark(".result");

  onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.search)
      this.props.history.push({
        pathname: "/search",
        state: {
          searchType: "Search",
          searchValue: this.state.search,
        },
      });
  };

  onChange = (e) => {
    e.persist();
    this.setState({ loading: true, search: e.target.value });
    this.searchMarker.unmark();
    if (!e.target.value) return;
    //implement your fetch logic for browse by search key here
    APIService.fetchSuggestions(e.target.value)
      .then((res) => {
        this.setState({ results: res.data, loading: false });
      })
      .catch((err) => {
        // console.log(err);
        return;
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
    if (!this.props.loggedIn) {
      return <Redirect to="/" />;
    }

    const { isFetching, categories, results, search, loading } = this.state;
    if (!loading) {
      this.searchMarker.mark(search, {
        seperateWordSearch: true,
        element: "span",
        className: "font-weight-bold text-pink",
        caseSensitive: false,
        exclude: ["span"],
      });
    }
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div className="container-fluid" style={{ paddingTop: "5%" }}>
          {isFetching && <LoadingPageComponent></LoadingPageComponent>}

          <div className="row" style={{ marginLeft: "10%" }}>
            <div className="col-md-6 col-12 p-0">
              <div className="text-default-black">
                <div className="display-2 d-none d-md-block">Welcome!</div>
                <div className="display-3 d-none d-sm-block d-md-none">
                  Welcome!
                </div>
                <div className="display-4 d-block d-sm-none">Welcome!</div>
              </div>
              <div className="text-default-black">
                <div className="h1 d-none d-md-block">
                  Find Best Masterpiece
                </div>
                <div className="h2 d-none d-sm-block d-md-none">
                  Find Best Masterpiece
                </div>
                <div className="h4 d-block d-sm-none">
                  Find Best Masterpiece
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 p-0 align-self-end text-right">
              <div>
                <div className="dropdown">
                  <button
                    className="btn text-default-black pr-5"
                    style={{
                      boxShadow: "-2px 2px 4px lightgrey",
                      borderTopLeftRadius: "20px",
                      borderBottomLeftRadius: "20px",
                    }}
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fa fa-chevron-down mr-2 text-default-black"></i>
                    Browse By Category
                  </button>
                  <ul
                    className="dropdown-menu text-center no-scrollbar"
                    style={{
                      maxHeight: "310px",
                    }}
                    aria-labelledby="dropdownMenuButton"
                  >
                    {!isFetching &&
                      categories.map((item) => (
                        <li
                          className="btn btn-link font-weight-bold dropdown-item"
                          onClick={this.onClickCategory}
                          id="category"
                        >
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-5 d-flex justify-content-center">
            <div className="col-xl-8 col-md-10 col-12 p-0 m-0">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
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
                    className="form-control form-control-lg pl-5"
                    style={{ borderRadius: "50px", height: "65px" }}
                    placeholder="Search by Keyword"
                    onChange={this.onChange}
                  />
                </div>
              </form>
              <div
                className="text-center d-flex justify-content-center"
                style={{ marginTop: "-30px", zIndex: "10", paddingTop: "40px" }}
              >
                <div
                  className="dropdown-menu p-0 border border-mute bg-white border-top-0 rounded-bottom"
                  data-display="static"
                  style={{
                    marginTop: "-26px",
                    marginLeft: "7.5%",
                    marginRight: "7.5%",
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
                  {results[1].map((result) => (
                    <button
                      className="btn-lg col-12 py-2 d-flex justify-content-left dropdown-item px-4 text-default-black"
                      onClick={(e) => {
                        this.onClickSuggestion(e, "Author", result.username);
                      }}
                    >
                      <div className="text-left mr-4">
                        <i className="fa fa-user"></i>
                      </div>
                      <div className="text-left result">
                        {result.username + "'s workshops"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ paddingTop: "20%" }}></div>
        </div>
        <FooterComponent></FooterComponent>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.authReducer.loggedIn,
  };
};

export default connect(mapStateToProps, null)(HomePageComponent);

import React, { Component } from "react";
import { connect } from "react-redux";
import FooterComponent from "./footer.component";
import HeaderComponent from "./header.component";
import { Redirect, Link } from "react-router-dom";
import { CourseCard } from "./courseCard.component";
import Mark from "mark.js";
import APIService from "../services/apiRequest.service";

export class LandingPageComponent extends Component {
  componentWillMount() {
    APIService.fetchCategories().then((res) => {
      var categories = res.data.map((item) => {
        return item.cateogry_title;
      });
      this.setState({ isFetching: false, categories: [...categories] });
    });
  }

  state = {
    loading: false,
    search: "",
    results: [[], []],
    categories: [],
  };

  searchMarker = new Mark(".result");

  onSubmit = (e) => {};

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

  onClick = (e) => {};

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

  oneItem = {
    id: "001",
    imageUrl: undefined,
    category: "Graphic Design",
    title: "Gift Card Workshop",
    author: "Ryoko",
    rating: 5.0,
    price: 16.55,
    enrolled: 14,
    sold: 12,
    view: "personal",
  };

  CardCategories = [
    {
      title: "Designing",
      quote: "Discover the designer within you",
      category: "Graphic Designing",
    },
    {
      title: "Art & Craft",
      quote: "Fill your life with vibrant colors",
      category: "Rangoli Art",
    },
    {
      title: "Decoration",
      quote: "Convert your personal space into fantasy land",
      category: "Home Decorations",
    },
    {
      title: "Style & Fashion",
      quote: "From wearing fashion to creating fashion",
      category: "Hair Styling",
    },
    {
      title: "Recycle Waste Art",
      quote: "Make the world a greener and cleaner space",
      category: "Recycle Material Ideas",
    },
  ];

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/home" />;
    }

    const { results, search, loading, categories } = this.state;
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

        <div style={{ marginLeft: "5%" }}>
          <div className="col-12 p-0 mt-5">
            <div className="text-default-black mt-5">
              <div className="display-2 d-none d-lg-block font-weight-bold">
                {"Discover Art & Ideas!"}
              </div>
              <div className="display-3 d-none d-md-block d-lg-none font-weight-bold">
                {"Discover Art & Ideas!"}
              </div>
              <div className="display-4 d-none d-sm-block d-md-none font-weight-bold">
                {"Discover Art & Ideas!"}
              </div>
              <div className="h1 d-block d-sm-none font-weight-bold">
                {"Discover Art & Ideas!"}
              </div>
            </div>
            <div className="text-default-black">
              <div className="h1 d-none d-md-block">
                Do Now. Anytime. Anywhere
              </div>
              <div className="h2 d-none d-sm-block d-md-none">
                Do Now. Anytime. Anywhere
              </div>
              <div className="h4 d-block d-sm-none">
                Do Now. Anytime. Anywhere
              </div>
            </div>
            <div className="text-black-default h3 mt-5">
              <div className="h3 d-none d-sm-block">Feel free to Create</div>
              <div className="h5 d-block d-sm-none">Feel free to Create</div>
            </div>
            <div className="text-black-default h3 mt-2">
              <Link
                to="/create-workshop"
                className="btn btn-lg btn-pink d-none d-sm-block"
                style={{ width: "15rem" }}
              >
                Become Creator
              </Link>
              <Link
                to="/create-workshop"
                className="btn btn-sm btn-pink  d-block d-sm-none"
                style={{ width: "10rem" }}
              >
                Become Creator
              </Link>
            </div>
            <img
              src={process.env.PUBLIC_URL + "/paint-brush.svg"}
              alt="..."
              style={{
                position: "absolute",
                right: "0px",
                top: "0px",
                width: "35%",
                maxWidth: "800px",
                zIndex: "-1",
              }}
            ></img>
          </div>
        </div>
        <div className="mt-5 pt-5 d-flex justify-content-center">
          <div className="col-xl-8 col-md-10 col-12 p-0 m-0 ">
            <form onSubmit={this.onSubmit} style={{ zIndex: "100" }}>
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
                  value={search}
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
                  marginInline: "7.5%",
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
                    className="lead col-12 py-2 d-flex justify-content-left dropdown-item px-4 text-default-black"
                    onClick={(e) => {
                      this.onClickSuggestion(e, "Workshop", result.title);
                    }}
                  >
                    <div className="text-left mr-4">
                      <i className="fa fa-book"></i>
                    </div>
                    <div className="result text-truncate">{result.title}</div>
                  </button>
                ))}
                {results[1].map((result) => (
                  <button
                    className="lead col-12 py-2 d-flex justify-content-left dropdown-item px-4 text-default-black"
                    onClick={(e) => {
                      this.onClickSuggestion(e, "Author", result.username);
                    }}
                  >
                    <div className="text-left mr-4">
                      <i className="fa fa-user"></i>
                    </div>
                    <div className="text-left result text-truncate">
                      {result.username + "'s workshops"}
                    </div>
                  </button>
                ))}
              </div>
            </div>{" "}
          </div>
        </div>
        <div style={{ paddingTop: "10%" }}></div>
        <div
          className="container-fluid text-center text-md-left text-center"
          style={{ paddingInline: "4.5%" }}
        >
          {this.CardCategories.map((onecategory) => (
            <div id="categoryContainer" className="my-5 pb-5 position-relative">
              <div className="text-default-black w-100">
                <div className="h2 font-weight-bold">{onecategory.title}</div>
                <div className="h4">{onecategory.quote}</div>
              </div>
              <div className="text-right">
                <Link
                  to={{
                    pathname: "/search",
                    state: {
                      searchType: "Category",
                      searchValue: onecategory.category,
                    },
                  }}
                  className="font-weight-bold lead btn-solid-link text-pink self-align-end"
                >
                  See All
                </Link>
              </div>

              <span
                className="d-flex position-absolute justify-content-between w-100 "
                style={{
                  top: "40%",
                  marginLeft: "-12px",
                  zIndex: 100,
                  background: "none",
                  height: 0,
                  overflow: "visible",
                }}
              >
                <button
                  onClick={(e) => {
                    e.persist();
                    e.target.parentNode.nextSibling.scrollLeft -= 250;
                  }}
                  className="btn-solid-link bg-white shadow rounded-circle"
                  style={{ width: 40, height: 40 }}
                >
                  <i className="fa fa-chevron-left bg-white shadow"></i>
                </button>
                <button
                  onClick={(e) => {
                    e.persist();
                    e.target.parentNode.nextSibling.scrollLeft += 250;
                  }}
                  className="btn-solid-link bg-white shadow rounded-circle"
                  style={{ width: 40, height: 40 }}
                >
                  <i className="fa fa-chevron-right bg-white shadow"></i>
                </button>
              </span>
              <div
                id="scrollContainer"
                className="d-flex justify-content-between flex-nowrap no-scrollbar"
                style={{
                  marginLeft: "-5%",
                  width: "110%",
                  paddingLeft: "5%",
                  paddingRight: "5%",
                }}
              >
                {Array(3)
                  .fill(this.oneItem)
                  .map(() => (
                    <div className="p-0 my-2 mr-4 d-flex">
                      <CourseCard oneitem={this.oneItem}></CourseCard>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          <div className="w-100 h4 font-weight-bold text-default-black">
            Browse through categories
          </div>
          <div className="w-100 d-flex flex-wrap justify-content-between">
            {categories.map((onecategory) => (
              <div className="col-12 col-md-6 col-lg-5 mr-0 mr-lg-1 p-4 text-center d-flex justify-content-center">
                <Link
                  className="btn-solid-link w-75 d-flex overflow-hidden capsulate shadow-sm border border-muted align-items-center"
                  to={{
                    pathname: "/search",
                    state: {
                      searchType: "Category",
                      searchValue: onecategory,
                    },
                  }}
                >
                  <div
                    className="w-50 overflow-hidden"
                    style={{ height: "80px" }}
                  >
                    <img
                      alt="..."
                      src={process.env.PUBLIC_URL + "/software-development.png"}
                    />
                  </div>
                  <span className="w-50 lead text-default-black">
                    {onecategory}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <FooterComponent></FooterComponent>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  if (!state.authReducer.loading) {
    return {
      isAuthenticated: state.authReducer.loggedIn,
    };
  }
};
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingPageComponent);

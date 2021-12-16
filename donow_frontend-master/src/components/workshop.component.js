import React, { Component } from "react";
import { connect } from "react-redux";
import HeaderComponent from "./header.component";
import { Link } from "react-router-dom";
import CreatorCard from "./CreatorCard.component";
import APIService from "../services/apiRequest.service";
import validator from "validator";
import LoadingPageComponent from "./loadingPage.component";
import DOMPurify from "dompurify";
import ReviewsComponent from "./reviews.component";
import DiscussionComponent from "./discussion.component";
import PostPanel from "./postPanel.component";
import FooterComponent from "./footer.component";
import StaticData from "./StaticData";
import ShareDialog from "./shareDialog.component";
import CartService from "../services/cartRequest.service";
import { CourseCard } from "./courseCard.component";

class WorkshopComponent extends Component {
  async componentDidMount() {
    var selfid = undefined;
    await APIService.fetchUser()
      .then((res) => {
        selfid = res.data.id;
        this.setState({ user: res.data });
      })
      .catch((err) => {
        this.props.history.push("/login");
        return;
      });
    if (!selfid) {
      this.props.history.push("/login");
      return;
    }

    var id = this.props.match.params.id;
    if (!id || !validator.isNumeric(id.toString()) || parseInt(id) < 0) {
      this.props.history.push("/404");
      return;
    }
    await APIService.fetchWorkshopByID(id, this.state.user.id)
      .then((res) => {
        this.setState({ workshop: res.data[0] });
        this.setState({
          workshop: {
            ...this.state.workshop,
            description: DOMPurify.sanitize(this.state.workshop.description),
          },
        });
        this.setIsInCart();
        APIService.fetchCreators({
          id: res.data[0].author.id,
          selfid: this.state.user.id,
        })
          .then((res) => {
            this.setState({ author: res.data[0], loading: false });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    await APIService.fetchWorkshops({
      searchType: "Category",
      searchValue: this.state.workshop.category,
      selfid: this.state.user.id,
      batch: 0,
    })
      .then((res) => {
        this.setState({
          suggestions: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setIsInCart = () => {
    this.setState({
      workshop: {
        ...this.state.workshop,
        cart: CartService.itemExists(this.state.workshop.id),
      },
    });
  };

  addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    var item = {
      ...this.state.workshop,
      author: {
        ...this.state.workshop.author,
        firstname: this.state.author.firstname,
        lastname: this.state.author.lastname,
      },
      imageUrl: this.state.workshop.coverurl,
    };
    let success = CartService.addToCart(item);
    if (success) this.setIsInCart();
    if (e.target.name && e.target.name === "buy")
      this.props.history.push("/user/cart");
  };

  removeFromCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let success = CartService.removeFromCart(this.state.workshop.id);
    if (success) this.setIsInCart();
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

  state = {
    loading: true,
    user: {},
    workshop: {
      id: 1,
      title: "",
      description: "",
      rating: 0,
      reviews: 0,
      favorite: false,
      costfreelesson: "",
      coverurl: "",
      price: 0,
      purchased: false,
      numberoflessons: 0,
      category: "",
      creator: undefined,
      owned: false,
    },
    author: {
      id: 1,
      username: "",
      firstname: "",
      lastname: "",
      bio: "",
      followers: 0,
      following: 0,
      followed: false,
    },
    suggestions: [],
    tab: "About",
    shareDialog: { display: false, link: "" },
  };

  tabs = ["About", "Reviews", "Discussion", "Past Projects"];

  changeTab = (tab) => {
    this.setState({ tab: tab });
  };

  shareLink = (e) => {
    var link = StaticData.FEURL + "workshop/" + this.state.workshop.id;
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

  toggleLocalFavorite = (e) => {
    APIService.ToggleFavorites(
      this.state.author.id,
      this.state.workshop.id
    ).then((res) => {
      this.setState({
        workshop: {
          ...this.state.workshop,
          favorite: res.data.status,
        },
      });
    });
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

  render() {
    const {
      loading,
      user,
      workshop,
      author,
      tab,
      shareDialog,
      suggestions,
    } = this.state;
    console.log(workshop.owned);
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div>
          {shareDialog.display && (
            <ShareDialog link={shareDialog.link}></ShareDialog>
          )}
        </div>
        {loading && <LoadingPageComponent></LoadingPageComponent>}
        {!loading && (
          <div className="conatiner-fluid">
            <div
              className="row px-md-5 px-4 pt-5 w-100 ml-0"
              style={{ boxShadow: "0px -3px 15px grey" }}
            >
              <div className="col-12 col-sm-6 col-md-8 col-lg-9">
                <h1>{workshop.title}</h1>
                <div className="d-md-flex justify-content-left align-items-center">
                  <div className="lead font-weight-bold p-0 text-pink card-text text-left">
                    {workshop.rating % 1
                      ? workshop.rating.toFixed(1)
                      : workshop.rating.toFixed(1)}
                  </div>
                  <div className="text-pink lead ml-md-2">
                    {Array(parseInt(workshop.rating))
                      .fill()
                      .map(() => (
                        <i className="fa fa-star pr-1"></i>
                      ))}
                    {workshop.rating !== 0 ? (
                      workshop.rating !== 5 ? (
                        <i
                          style={{
                            width:
                              (workshop.rating % 1).toFixed(1) * 18.0 + "px",
                            overflowX: "hidden",
                            display:
                              workshop.rating - parseInt(workshop.rating)
                                ? "inline-block"
                                : "none",
                          }}
                          className={"fa fa-star pr-1 align-middle mb-1"}
                        ></i>
                      ) : null
                    ) : (
                      Array(5)
                        .fill()
                        .map(() => <i className="fa fa-star-o pr-1"></i>)
                    )}
                  </div>
                  <div className="text-black-default ml-md-3 font-weight-bold">
                    ({workshop.reviews + " reviews"})
                  </div>
                </div>
                <div className="mt-3 d-flex justify-content-left align-items-center">
                  <span>Created By</span>
                  <Link className="text-pink font-weight-bold ml-1">
                    {author.firstname + " " + author.lastname}
                  </Link>
                </div>
                <div className="mt-3 d-flex justify-content-left align-items-center">
                  {!workshop.owned && (
                    <button
                      onClick={this.toggleLocalFavorite}
                      className="btn btn-danger btn-outline-pink d-flex justify-content-center rounded mr-3"
                    >
                      <span>Wishlist</span>
                      <span>
                        {workshop.favorite ? (
                          <i className="fa fa-heart ml-1"></i>
                        ) : (
                          <i className="fa fa-heart-o ml-1"></i>
                        )}
                      </span>
                    </button>
                  )}
                  <button
                    onClick={this.shareLink}
                    className="btn btn-danger btn-outline-pink d-flex justify-content-center rounded"
                  >
                    <span>Share</span>
                    <span>
                      <i className="fa fa-share-alt ml-1"></i>
                    </span>
                  </button>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-0 bg-pink border border-muted shadow rounded">
                <div className="w-100">
                  <div>
                    <button
                      style={{
                        position: "absolute",
                        left: "45%",
                        top: "15%",
                      }}
                      className="btn-solid-link mt-5 mt-sm-3 mt-md-1 mt-lg-2 mt-xl-4"
                    >
                      <i
                        className="text-white lead fa fa-play p-3 bg-dark rounded-circle"
                        style={{ opacity: 0.5 }}
                      ></i>
                    </button>
                    <img
                      alt="cover"
                      src={process.env.PUBLIC_URL + "/logo.svg"}
                      className="w-100 rounded"
                    />
                  </div>
                  <div className="text-left text-default-grey p-4 h3 font-weight-bold">
                    {"$ " + workshop.price}
                  </div>
                  {!workshop.owned && !workshop.purchased && !workshop.cart ? (
                    <div className="text-center text-default-grey px-4 h3 font-weight-bold">
                      <button
                        name="cart"
                        onClick={this.addToCart}
                        className="btn btn-pink shadow-lg rounded btn-sm btn-block"
                      >
                        Add to Cart
                      </button>
                      <button
                        name="buy"
                        className="btn my-2 btn-default-black shadow rounded btn-sm btn-block"
                        onClick={this.addToCart}
                      >
                        Buy Now
                      </button>
                    </div>
                  ) : workshop.cart ? (
                    <div className="text-center text-default-grey px-4 h3 font-weight-bold">
                      <button
                        onClick={this.removeFromCart}
                        className="btn btn-pink shadow-lg rounded btn-sm btn-block"
                      >
                        Remove from Cart
                      </button>
                    </div>
                  ) : workshop.enrolled ? (
                    <div className="text-center text-default-grey px-4 h3 font-weight-bold">
                      <button className="btn my-2 btn-default-black shadow rounded btn-sm btn-block">
                        Go To Lessons
                      </button>
                    </div>
                  ) : workshop.purchased ? (
                    <div className="text-center text-default-grey px-4 h3 font-weight-bold">
                      <button className="btn my-2 btn-default-black shadow rounded btn-sm btn-block">
                        Enroll Now
                      </button>
                    </div>
                  ) : (
                    workshop.owned && (
                      <div className="text-center text-default-grey px-4 h3 font-weight-bold">
                        <button className="btn my-2 btn-default-black shadow rounded btn-sm btn-block">
                          View Lessons
                        </button>
                      </div>
                    )
                  )}
                  <div className="text-left text-default-grey px-4 py-4 font-weight-bold">
                    <div>This course includes:</div>
                    <div>{workshop.numberoflessons + " video lessons"}</div>
                  </div>
                </div>
              </div>
              <div className="col-12 pt-5">
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
            </div>
            {tab === "About" && (
              <div className="row px-md-5 px-4 w-100 ml-0 pb-5 border-bottom border-dark">
                <div className="pt-5 col-12 col-xl-8 col-lg-7 col-md-6 col-sm-12">
                  <div className="text-black-default font-weight-bold pb-4">
                    About this Course:
                  </div>
                  <div
                    className="text-black-default"
                    dangerouslySetInnerHTML={{ __html: workshop.description }}
                  ></div>
                </div>
                <div className="pt-5 col-12 col-xl-4 col-lg-5 col-md-6 col-sm-12 d-flex justify-content-center justify-md-content-end">
                  <CreatorCard oneitem={author}></CreatorCard>
                </div>
              </div>
            )}
            {tab === "Reviews" && (
              <ReviewsComponent
                reviews={workshop.reviews}
                rating={workshop.rating}
                id={workshop.id}
              ></ReviewsComponent>
            )}
            {tab === "Discussion" && (
              <DiscussionComponent
                type={"Workshop"}
                id={workshop.id}
                selfid={user.id}
              ></DiscussionComponent>
            )}
            {tab === "Past Projects" && (
              <div>
                <div className="px-5 pt-5 d-flex justify-content-between w-100">
                  <div className="h2">Students' work under this course</div>
                  <label
                    style={{ cursor: "pointer" }}
                    className="text-right d-flex align-items-center justify-content-end"
                  >
                    <input
                      type="file"
                      name="workurl"
                      accept="image/*"
                      className="d-none"
                      onChange={(e) => {}}
                    />
                    <span className="font-weight-bold">
                      {"Upload your work"}
                    </span>
                    <i
                      className="fa fa-paperclip text-pink ml-2 mt-1"
                      style={{
                        fontSize: "40px",
                        transform: "rotateY(180deg)",
                      }}
                    ></i>
                  </label>
                </div>
                <PostPanel
                  type={"Workshop"}
                  id={workshop.id}
                  selfid={user.id}
                ></PostPanel>
              </div>
            )}
            <div className="pt-5 px-md-5 px-4 w-100 ml-0 pb-3 lead font-weight-bold">
              Suggested Workshops
            </div>

            <div className="row m-0 py-5">
              {!this.state.fetching && suggestions.length === 0 && (
                <div className="w-100 text-muted text-center">
                  No suggestions to show
                </div>
              )}
              {!loading &&
                suggestions.map((result) =>
                  result.id !== workshop.id ? (
                    <div className="col-12 col-xl-4 col-md-6 my-2 d-flex justify-content-center">
                      <CourseCard
                        shareLink={this.shareLink}
                        oneitem={result}
                        toggleFavorite={this.toggleFavorite}
                      ></CourseCard>
                    </div>
                  ) : (
                    suggestions.length === 1 && (
                      <div className="w-100 text-muted text-center">
                        No suggestions to show
                      </div>
                    )
                  )
                )}
            </div>
          </div>
        )}
        <FooterComponent></FooterComponent>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WorkshopComponent);

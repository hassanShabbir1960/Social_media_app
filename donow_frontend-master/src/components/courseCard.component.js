import React, { Component } from "react";
import { connect } from "react-redux";
import StaticData from "./StaticData";
import { Link, Redirect } from "react-router-dom";
import CartService from "../services/cartRequest.service";

export class CourseCard extends Component {
  componentDidMount() {
    this.setIsInCart();
  }

  state = {
    oneitem: this.props.oneitem,
    redirectToCart: false,
  };

  setIsInCart = () => {
    this.setState({
      oneitem: {
        ...this.state.oneitem,
        cart: CartService.itemExists(this.state.oneitem.id),
      },
    });
  };
  addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let success = CartService.addToCart(this.state.oneitem);
    if (success) this.setIsInCart();
    if (e.target.name && e.target.name === "buy")
      this.setState({
        redirectToCart: true,
      });
  };
  removeFromCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let success = CartService.removeFromCart(this.state.oneitem.id);
    if (success) this.setIsInCart();
  };

  shareLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.shareLink) {
      this.props.shareLink(
        StaticData.FEURL + "workshop/" + this.props.oneitem.id
      );
    }
  };

  toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.toggleFavorite(this.props.oneitem.id);
    this.setState({
      oneitem: {
        ...this.state.oneitem,
        favorite: !this.state.oneitem.favorite,
      },
    });
  };

  render() {
    const { oneitem } = this.state;
    if (this.state.redirectToCart) {
      return <Redirect to="/user/cart"></Redirect>;
    }
    return (
      <Link className="solid-link" to={"/workshop/" + oneitem.id}>
        <div className="card border-0 rounded" style={{ width: "22rem" }}>
          <img
            src={
              oneitem.imageUrl
                ? StaticData.BEURL + oneitem.imageUrl
                : process.env.PUBLIC_URL + "/course-management-icon.svg"
            }
            height="200px"
            className="card-img-top shadow"
            style={{ borderRadius: "20px" }}
            alt="..."
          />
          <div className="p-1 d-flex justify-content-between align-items-center">
            <small className="text-pink card-text text-left">
              {oneitem.category}
            </small>
            <div className="text-default-black lead">
              {!oneitem.owned && (
                <button
                  onClick={this.toggleFavorite}
                  className="btn-solid-link"
                >
                  {oneitem.favorite ? (
                    <i className="fa fa-heart pr-2 text-pink"></i>
                  ) : (
                    <i className="fa fa-heart-o pr-2 text-default-black"></i>
                  )}
                </button>
              )}
              <button onClick={this.shareLink} className="btn-solid-link">
                <i className="fa fa-share-alt pl-2 text-default-black"></i>
              </button>
            </div>
          </div>
          <div className="pt-2 d-flex justify-content-between">
            <span className="lead text-default-black font-weight-bold card-text text-left">
              {oneitem.title}
            </span>
            <small className="text-pink align-top">
              <span className="mr-1">{oneitem.sold}</span>
              <span>sold</span>
            </small>
          </div>
          <div>
            <span className="p-0 text-default-black card-text text-left">
              {oneitem.author.firstname + " " + oneitem.author.lastname}
            </span>
          </div>
          <div className="d-flex justify-content-left">
            <span className="lead font-weight-bold p-0 text-pink card-text text-left">
              {oneitem.rating % 1
                ? oneitem.rating.toFixed(1)
                : oneitem.rating.toFixed(1)}
            </span>
            <span className="text-pink lead ml-2">
              {Array(parseInt(oneitem.rating))
                .fill()
                .map(() => (
                  <i className="fa fa-star pr-1"></i>
                ))}
              {oneitem.rating !== 0 ? (
                oneitem.rating !== 5 ? (
                  <i
                    style={{
                      width: (oneitem.rating % 1).toFixed(1) * 18.0 + "px",
                      overflowX: "hidden",
                      display:
                        oneitem.rating - parseInt(oneitem.rating)
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
            </span>
          </div>

          <div className="d-flex justify-content-between">
            <span className="p-0 text-default-black font-weight-bold card-text text-left">
              {"$ " + oneitem.price}
            </span>
            {!oneitem.owned && !oneitem.purchased && !oneitem.cart ? (
              <span className="d-flex justify-content-end">
                <button
                  name="cart"
                  onClick={this.addToCart}
                  className="btn-solid-link text-pink d-flex align-items-center justify-content-center mt-1 mr-2"
                >
                  <i className="fa fa-shopping-cart mr-1"></i>
                  <span>Add to Cart</span>
                </button>
                <button
                  name="buy"
                  onClick={this.addToCart}
                  className="ml-2 px-3 btn btn-sm btn-pink rounder"
                >
                  Buy
                </button>
              </span>
            ) : (
              oneitem.cart && (
                <span className="d-flex justify-content-end">
                  <button
                    onClick={this.removeFromCart}
                    className="btn-solid-link text-pink d-flex justify-content-center mt-1 mr-2"
                  >
                    <i className="fa fa-minus-circle mr-1 align-self-center"></i>
                    <span>Remove from Cart</span>
                  </button>
                </span>
              )
            )}
            {(oneitem.owned || oneitem.purchased) && (
              <span className="text-right">
                <div className="text-pink font-weight-bold">
                  {oneitem.enrolled + " enrolled"}
                </div>
                <button className="btn btn-outline-danger border-0 rounded-circle align-end">
                  <i className="fa fa-trash-o"></i>
                </button>
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CourseCard);

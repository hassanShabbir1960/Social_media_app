import React, { Component } from "react";
import { connect } from "react-redux";
import StaticData from "./StaticData";

class CartItem extends Component {
  state = {
    oneitem: this.props.oneitem,
  };

  removeFromCart = (e) => {
    this.props.removeFromCart(this.state.oneitem.id);
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
    return (
      <div className="w-100 d-sm-flex py-sm-5 px-sm-2 p-0">
        <div className="col-12 col-sm-6 col-md-5">
          <div className="rectangle-ratio-box rounder border border-muted w-100">
            <img
              src={
                oneitem.imageUrl
                  ? StaticData.BEURL + oneitem.imageUrl
                  : process.env.PUBLIC_URL + "/paint-brush.svg"
              }
              className="card-img-top shadow rectangle-ratio-content"
              alt="..."
            />
          </div>
          <div className="pt-1 d-flex justify-content-between align-items-center">
            <small className="text-pink card-text text-left">
              {oneitem.category}
            </small>
            <div className="text-default-black lead">
              <button onClick={this.shareLink} className="btn-solid-link">
                <i className="fa fa-share-alt pl-2 text-default-black"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-7 pt-1 position-relative">
          <div className="d-flex justify-content-between">
            <span className="lead text-default-black font-weight-bold card-text text-left">
              {oneitem.title}
            </span>
            <div>
              <button
                onClick={this.removeFromCart}
                className="btn btn-lg btn-outline-danger border-0 rounded-circle"
              >
                <i className="fa fa-trash-o"></i>
              </button>
            </div>
          </div>
          <div>
            <span className="p-0 text-default-black card-text text-left">
              {oneitem.author.firstname + " " + oneitem.author.lastname}
            </span>
          </div>
          <div className="d-sm-flex justify-content-left">
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
          <div
            className="text-default-black font-weight-bold position-absolute"
            style={{ bottom: 0, right: 0 }}
          >
            <div>Price</div>
            <div className="text-pink">{"$ " + oneitem.price}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);

import React, { Component } from "react";
import { connect } from "react-redux";
import APIService from "../services/apiRequest.service";
import StaticData from "./StaticData";

class CommentItemComponent extends Component {
  componentDidMount() {
    this.setState({
      params: {
        ...this.state.params,
        searchValue: this.props.comment.id,
        selfid: this.props.selfid,
      },
    });
  }

  fetch = () => {
    this.setState({ loading: true });
    APIService.fetchDiscussions(this.state.params).then((res) => {
      this.setState((state) => {
        const comments = state.comments.concat(...res.data);
        return {
          comments: comments,
          loading: false,
        };
      });
      res.data.length < 12
        ? this.setState({ params: { ...this.state.params, batch: -1 } })
        : this.setState({
            params: {
              ...this.state.params,
              batch: this.state.params.batch + 1,
            },
          });
    });
  };

  toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.toggleLike(this.props.comment.id);
    this.setState({
      comment: {
        ...this.state.comment,
        likes: this.state.comment.liked
          ? this.state.comment.liked - 1
          : this.state.comment.liked + 1,
        liked: !this.state.comment.liked,
      },
    });
  };

  state = {
    comment: this.props.comment,
    loading: false,
  };

  getTime = (timestamp) => {
    var now = Date.now() / 1000;
    var difference = now - timestamp;
    if (difference < 60) return "A few seconds ago";
    difference /= 60;
    if (difference < 60)
      return Math.floor(difference).toString() + " minute(s) ago";
    difference /= 60;
    if (difference < 24)
      return Math.floor(difference).toString() + " hour(s) ago";
    difference /= 24;
    if (difference < 7)
      return Math.floor(difference).toString() + " day(s) ago";
    if (difference < 30)
      return Math.floor(difference / 7).toString() + " week(s) ago";
    difference /= 30;
    if (difference < 12)
      return Math.floor(difference).toString() + " month(s) ago";
    difference /= 12;
    return Math.floor(difference).toString() + " year(s) ago";
  };

  render() {
    const { comment } = this.state;
    return (
      <div className="container-fluid my-2 w-100 border border-muted rounded p-1">
        <div className="d-flex justify-content-left w-100 align-items-center">
          <div>
            <img
              alt="profile"
              width={30}
              className="pr-1"
              src={
                comment.user.imageURL
                  ? StaticData.BEURL + comment.user.imageURL
                  : process.env.PUBLIC_URL + "/user-icon.svg"
              }
            />
          </div>

          <div className="font-weight-bold text-default-black">
            {comment.user.firstname + " " + comment.user.lastname}
          </div>
        </div>

        <div className="w-100">
          <div className="w-100">{comment.body}</div>
          <div className="w-100 d-flex justify-content-start">
            <div className="d-flex justify-content-start align-items-center">
              <span className="mr-1">{comment.likes}</span>
              <button className="btn-solid-link" onClick={this.toggleLike}>
                {comment.liked ? (
                  <span className="text-pink">
                    <i className="fa fa-heart"></i>
                  </span>
                ) : (
                  <span className="text-black-default">
                    <i className="fa fa-heart-o"></i>
                  </span>
                )}
              </button>
            </div>
            <small className="text-muted ml-2">
              {this.getTime(comment.timestamp)}
            </small>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentItemComponent);

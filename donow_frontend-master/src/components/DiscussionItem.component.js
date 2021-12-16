import React, { Component } from "react";
import { connect } from "react-redux";
import APIService from "../services/apiRequest.service";

class DiscussionItemComponent extends Component {
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
    loading: false,
    comments: [],
    params: {
      searchType: "Parent",
      searchValue: undefined,
      batch: 0,
    },
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
    const { comment } = this.props;
    const { loading, comments, params } = this.state;
    return (
      <div className="container-fluid my-5 w-100">
        <div className="d-sm-flex justify-content-left w-100">
          <div>
            <img
              alt="profile"
              width={150}
              className="d-sm-block d-none rounded-circle p-3"
              src={process.env.PUBLIC_URL + "/user-icon.svg"}
            />
          </div>
          <div className="flex-fill">
            <h3 className="pb-1">
              {comment.user.firstname + " " + comment.user.lastname}
            </h3>
            <div className="w-100">{comment.body}</div>
            <small>{this.getTime(comment.timestamp)}</small>
            <div className="d-flex justify-content-end">
              <span>{comment.comments}</span>
              <span className="text-black-default mr-2">
                <i className="fa fa-comment-o"></i>
              </span>
              <span>{comment.likes}</span>
              <button
                className="btn-solid-link"
                onClick={this.toggleLike}
              ></button>
            </div>
            <div className="dropdown-divider w-50"></div>
            {comments.map((nested) => (
              <div className="bg-default-grey my-3 p-3 rounder">
                <div className="d-sm-flex justify-content-left">
                  <div>
                    <img
                      alt="profile"
                      width={50}
                      className="d-sm-block d-none rounded-circle p-2"
                      src={process.env.PUBLIC_URL + "/user-icon.svg"}
                    />
                  </div>
                  <div>
                    <div className="d-flex justify-content-start pb-1">
                      <span className="lead font-weight-bold">
                        {nested.user.firstname + " " + nested.user.lastname}
                      </span>
                      <span className="d-sm-block d-none ml-2 align-self-end">
                        {" replied"}
                      </span>
                    </div>
                    <div className="w-100">{nested.body}</div>
                    <small>{this.getTime(nested.timestamp)}</small>
                  </div>
                </div>
              </div>
            ))}
            {!loading && params.batch !== -1 && comment.comments > 0 && (
              <button onClick={this.fetch} className="btn-solid-link text-pink">
                View more
              </button>
            )}
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
)(DiscussionItemComponent);

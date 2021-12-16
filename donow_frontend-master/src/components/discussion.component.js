import React, { Component } from "react";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import APIService from "../services/apiRequest.service";
import DiscussionItemComponent from "./DiscussionItem.component";
import CommentItemComponent from "./CommentItem.component";

class DiscussionComponent extends Component {
  async componentDidMount() {
    await this.setState({
      params: {
        ...this.state.params,
        searchType: this.props.type,
        searchValue: this.props.id,
        selfid: this.props.selfid,
      },
    });
    this.fetch();
  }

  fetch = () => {
    this.setState({ loading: true });
    APIService.fetchDiscussions(this.state.params).then((res) => {
      this.setState((state) => {
        const comments = this.state.comments.concat(...res.data);
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

  toggleLike = (commentID) => {
    APIService.ToggleDiscussionLikes(commentID).then((res) => {
      this.setState((state) => {
        var comments = [...state.comments];
        var index = comments.findIndex((p) => p.id === commentID);
        comments[index].liked = res.data.status;
        return {
          comments: [...comments],
        };
      });
    });
  };

  state = {
    loading: true,
    comments: [],
    params: {
      searchType: "Workshop",
      searchValue: undefined,
      batch: 0,
    },
  };

  oneComment = {
    id: 1,
    timestamp: 1597522909934,
    body:
      "This is a very very very very very very very very very very very very very very very very very very very very very very long body",
    user: {
      firstname: "David",
      lastname: "Brax",
      imageurl: "",
    },
    likes: 4,
    comments: 2,
    liked: false,
  };

  render() {
    const { loading, params, comments } = this.state;
    return params.searchType !== "Post" ? (
      <div className="container-fluid px-md-5 px-4 w-100 ml-0 py-5 border-bottom border-dark">
        {!loading &&
          comments.map((comment) => (
            <DiscussionItemComponent
              toggleFavorite={this.toggleLike}
              comment={comment}
              selfid={this.props.selfid}
            ></DiscussionItemComponent>
          ))}
        <div className="text-center text-muted">
          {loading ? (
            <Loader type="ThreeDots" color="#cd3333" width={40}></Loader>
          ) : (
            params.batch !== -1 && (
              <button
                onClick={this.fetch}
                className="alert-link btn-solid-link text-pink"
              >
                Load More
              </button>
            )
          )}
          {!loading && comments.length === 0 && "No discussions to show"}
        </div>
      </div>
    ) : (
      <div className="container-fluid px-1 w-100 ml-0 py-5">
        {!loading &&
          comments.map((comment) => (
            <CommentItemComponent
              toggleLike={this.toggleLike}
              comment={comment}
              selfid={this.props.selfid}
            ></CommentItemComponent>
          ))}
        <div className="text-center text-muted">
          {loading ? (
            <Loader type="ThreeDots" color="#cd3333" width={40}></Loader>
          ) : (
            params.batch !== -1 && (
              <button
                onClick={this.fetch}
                className="alert-link btn-solid-link text-pink"
              >
                Load More
              </button>
            )
          )}
          {!loading && comments.length === 0 && "No discussions to show"}
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
)(DiscussionComponent);

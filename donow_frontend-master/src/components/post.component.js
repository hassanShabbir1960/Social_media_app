import React, { Component } from "react";
import { connect } from "react-redux";
import StaticData from "./StaticData";

class Post extends Component {
  showPost = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.showPost(this.props.i);
  };

  shareLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.shareLink) {
      this.props.shareLink(StaticData.FEURL + "post/" + this.props.post.id);
    }
  };

  toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.toggleFavorite(this.props.post.id);
    this.setState({
      post: {
        ...this.state.post,
        liked: !this.state.post.liked,
      },
    });
  };

  state = {
    post: this.props.post,
  };
  render() {
    const { post } = this.state;
    return (
      <div
        onClick={this.showPost}
        className="p-0 solid-link container-fluid my-3"
      >
        <div className="w-100 d-flex square-ratio-box shadow">
          <div className="square-ratio-content d-flex justify-content-center border border-muted rounded align-items-center">
            <img
              alt="post"
              style={{ maxHeight: "100%", maxWidth: "100%" }}
              src={post.imageURL && StaticData.BEURL + post.imageURL}
            />
          </div>
        </div>
        <div className="d-flex lead justify-content-between px-1">
          <div>
            <button className="btn-solid-link" onClick={this.toggleFavorite}>
              {post.liked ? (
                <i className="fa fa-heart text-pink mr-2"></i>
              ) : (
                <i className="fa fa-heart-o text-default-black mr-2"></i>
              )}
            </button>
            <button className="btn-solid-link ml-1">
              <i className="fa fa-comment-o"></i>
              <span>{post.comments}</span>
            </button>
          </div>
          <button onClick={this.shareLink} className="btn-solid-link">
            <i className="fa fa-share-alt text-pink"></i>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Post);

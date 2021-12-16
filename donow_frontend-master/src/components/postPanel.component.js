import React, { Component } from "react";
import { connect } from "react-redux";
import APIService from "../services/apiRequest.service";
import Post from "./post.component";
import $ from "jquery";
import StaticData from "./StaticData";
import ShareDialog from "./shareDialog.component";
import DiscussionComponent from "./discussion.component";

class PostPanel extends Component {
  async componentDidMount() {
    await this.setState({
      params: {
        ...this.state.params,
        searchType: this.props.type,
        id: this.props.id,
        selfid: this.props.selfid,
      },
    });

    this.fetch();
  }

  onePost = {
    id: 1,
    imageurl: process.env.PUBLIC_URL + "/clock-icon.svg",
    body:
      "This is a very very very very very very very very very very very very very very very long body.",
    timestamp: 1597579056,
    user: {
      id: 1,
      firstname: "David",
      lastname: "Brax",
      imageurl: process.env.PUBLIC_URL + "/user-icon.svg",
    },
    liked: false,
    likes: 5,
    comments: 12,
    courseid: 4,
  };

  fetch = () => {
    this.setState({ loading: true });
    APIService.GetPosts(this.state.params).then((res) => {
      this.setState((state) => {
        const posts = state.posts.concat(...res.data);
        return {
          posts: posts,
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

  showPost = async (i) => {
    console.log(this.state.posts[i]);
    await this.setState({
      modal: {
        loading: false,
        index: i,
        post: this.state.posts[i],
        comments: [],
        typedComment: "",

        params: {
          searchType: "Post",
          searchValue: this.state.posts[i].id,
          batch: 0,
        },
      },
    });
    $("#postModal").modal("show");
  };

  onSwitchPost = (direction) => {
    let newIndex = this.state.modal.index + direction;
    if (newIndex < 0) newIndex = this.state.posts.length - 1;
    else newIndex = newIndex % this.state.posts.length;
    if (newIndex === this.state.modal.index) return;
    this.setState({
      modal: {
        loading: false,
        index: newIndex,
        post: this.state.posts[newIndex],
        comments: [],
        typedComment: "",

        params: {
          searchType: "Post",
          searchValue: this.state.posts[newIndex].id,
          batch: 0,
        },
      },
    });
  };

  onChange = (e) => {
    if (this.state.modal.typedComment.length >= 500) return;
    this.setState({
      modal: {
        ...this.state.modal,
        typedComment: e.target.value,
      },
    });
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

  onSubmitComment = () => {
    // APIService.N
  };

  toggleFavorite = (postID) => {
    APIService.TogglePostLikes(postID).then((res) => {
      this.setState((state) => {
        var posts = [...state.posts];
        var index = posts.findIndex((p) => p.id === postID);
        posts[index].liked = res.data.status;
        posts[index].likes += res.data.status ? 1 : -1;
        return {
          posts: [...posts],
        };
      });
    });
  };

  fetchComments = () => {
    APIService.fetchDiscussions(this.state.modal.params).then((res) => {
      this.setState((state) => {
        const comments = state.model.comments.concat(res.data);

        return {
          modal: {
            ...this.state.modal,
            comments: comments,
          },
        };
      });
    });
  };

  state = {
    loading: true,
    posts: [],
    params: {
      searchType: "User",
      id: undefined,
      selfid: undefined,
      batch: 0,
    },
    modal: {
      loading: false,
      index: null,
      post: null,
      comments: [],
      typedComment: "",

      params: {
        searchType: "Post",
        searchValue: null,
        batch: 0,
      },
    },
    shareDialog: { display: false, link: "" },
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
    const { loading, posts, modal, shareDialog } = this.state;
    return (
      <div className="container-fluid py-5 border-bottom border-dark">
        <div>
          {shareDialog.display && (
            <ShareDialog link={shareDialog.link}></ShareDialog>
          )}
        </div>{" "}
        <div className="row">
          {posts.map((post, i) => (
            <div className="text-center col-12 col-sm-6 col-md-4 col-xl-2">
              <Post
                toggleFavorite={this.toggleFavorite}
                shareLink={this.shareLink}
                showPost={this.showPost}
                i={i}
                post={post}
              ></Post>
            </div>
          ))}
        </div>
        {!loading && posts.length === 0 && (
          <div className="text-center text-muted">No posts to show</div>
        )}
        {modal.post && (
          <div
            className="modal fade"
            id="postModal"
            tabindex="-1"
            aria-labelledby="postModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="row m-0 p-0">
                  <div
                    className="col-12 col-lg-7 p-0 bg-default-black d-flex justify-content-center align-items-center"
                    style={{ height: "80vh" }}
                  >
                    <div
                      style={{ top: "45%" }}
                      className="position-absolute w-100 px-4 d-flex justify-content-between"
                    >
                      <button
                        onClick={() => {
                          this.onSwitchPost(-1);
                        }}
                        className="btn btn-lg btn-solid-link text-default-grey"
                      >
                        <i className="fa fa-chevron-left"></i>
                      </button>
                      <button
                        onClick={() => {
                          this.onSwitchPost(1);
                        }}
                        className="btn btn-lg btn-solid-link text-default-grey"
                      >
                        <i className="fa fa-chevron-right"></i>
                      </button>
                    </div>
                    <img
                      alt="..."
                      src={
                        modal.post.imageURL &&
                        StaticData.BEURL + modal.post.imageURL
                      }
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  </div>
                  <div
                    className="col-12 col-lg-5 p-0"
                    style={{ height: "80vh" }}
                  >
                    <div className="modal-header ">
                      <div className="d-flex align-items-center">
                        <img
                          alt="..."
                          src={
                            modal.post.user.profileImage
                              ? StaticData.BEURL + modal.post.user.profileImage
                              : process.env.PUBLIC_URL + "/user-icon.svg"
                          }
                          width={30}
                        />
                        <span className="text-default-black font-weight-bold ml-1">
                          {modal.post.user.firstname +
                            " " +
                            modal.post.user.lastname}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>

                    <div className="border-bottom border-muted p-1 text-default-black">
                      {modal.post.body}
                    </div>
                    <div style={{ height: "40%", overflowY: "scroll" }}>
                      <DiscussionComponent
                        type={"Post"}
                        id={modal.post.id}
                        selfid={this.props.selfid}
                      ></DiscussionComponent>
                    </div>
                    <div className="py-2 w-100 modal-footer border-top border-dark">
                      <div className="d-flex w-100 ">
                        <button
                          onClick={() => {
                            this.toggleFavorite(modal.post.id);
                          }}
                          className="btn-lg btn-solid-link mr-2"
                        >
                          {modal.post.liked ? (
                            <i className="fa fa-heart text-pink"></i>
                          ) : (
                            <i className="fa fa-heart-o text-default-black"></i>
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            if (modal.comments.length === 0)
                              this.fetchComments(e);
                          }}
                          className="btn-lg btn-solid-link mr-2"
                        >
                          <i className="fa fa-comment-o text-default-black"></i>
                        </button>
                        <button
                          onClick={() => {
                            $("#postModal").modal("hide");
                            this.shareLink(
                              StaticData.FEURL + "post/" + modal.post.id
                            );
                          }}
                          className="btn-lg btn-solid-link mr-2"
                        >
                          <i className="fa fa-share-alt text-default-black"></i>
                        </button>
                      </div>
                      <span className="w-100 mt-3 text-default-black">
                        {modal.post.likes + " likes"}
                      </span>{" "}
                      <span className="w-100 text-default-black">
                        {modal.post.comments + " comments"}
                      </span>
                      <div className="d-flex w-100 text-muted justify-content-between">
                        <small>{this.getTime(modal.post.timestamp)}</small>
                        <small>{modal.typedComment.length + "/500"}</small>
                      </div>
                    </div>
                    <div className="px-2 w-100 modal-footer border-top border-dark text-right">
                      <textarea
                        name="typedComment"
                        value={modal.typedComment}
                        type="text"
                        className="position-absolute border-0 form-control w-75 overflow-visible"
                        rows="1"
                        maxLength="500"
                        placeholder="Add a comment"
                        style={{
                          resize: "none",
                          overflow: "hidden",
                          maxHeight: "50%",
                          left: 0,
                        }}
                        onBlur={(e) => {
                          e.target.scrollTop = 0;
                          e.target.rows = 1;
                        }}
                        onFocus={(e) => {
                          e.target.rows = Math.min(
                            5,
                            e.target.scrollHeight / 24
                          );
                        }}
                        onChange={(e) => {
                          e.target.rows = 1;
                          e.target.rows = Math.min(
                            5,
                            e.target.scrollHeight / 24
                          );
                          this.onChange(e);
                        }}
                      ></textarea>
                      <button
                        onClick={this.onSubmitComment}
                        className="btn btn-solid-link text-pink alert-link"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PostPanel);

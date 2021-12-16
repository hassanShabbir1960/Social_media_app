import React, { Component } from "react";
import { connect } from "react-redux";
import APIService from "../services/apiRequest.service";

class ReviewsComponent extends Component {
  async componentDidMount() {
    await this.setState({
      params: {
        ...this.state.params,
        workshop: this.props.id,
      },
    });
    this.fetch();
  }

  oneReview = {
    id: 1,
    rating: 4,
    body:
      "This is a very very very very very very very very very very very very very very very very very very very very very very long body",
    user: {
      firstname: "David",
      lastname: "Brax",
      imageurl: "",
    },
  };

  state = {
    loading: true,
    reviews: [],
    params: {
      workshop: undefined,
      batch: 0,
    },
  };

  fetch = () => {
    this.setState({ loading: true });
    APIService.GetReviews(this.state.params).then((res) => {
      this.setState((state) => {
        const reviews = this.state.reviews.concat(...res.data);
        return {
          reviews: reviews,
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

  render() {
    const { reviews } = this.state;
    return (
      <div className="container-fluid text-black-default px-md-5 px-4 w-100 ml-0 py-5 border-bottom border-dark">
        <div className="d-flex justify-content-left lead">Course Ratings</div>
        <div className="d-flex justify-content-left pt-3">
          <span
            className="lead font-weight-bold p-0 text-pink card-text text-left"
            style={{ fontSize: "30px" }}
          >
            {this.props.rating % 1
              ? this.props.rating.toFixed(1)
              : this.props.rating.toFixed(1)}
          </span>
          <span className="text-pink lead ml-2" style={{ fontSize: "30px" }}>
            {Array(parseInt(this.props.rating))
              .fill()
              .map(() => (
                <i className="fa fa-star pr-1"></i>
              ))}
            {this.props.rating !== 0 ? (
              this.props.rating !== 5 ? (
                <i
                  style={{
                    width: (this.props.rating % 1).toFixed(1) * 18.0 + "px",
                    overflowX: "hidden",
                    display:
                      this.props.rating - parseInt(this.props.rating)
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
          <span className="text-black-default ml-3 align-self-end">
            {"Based on " + this.props.reviews + " reviews"}
          </span>
        </div>
        <div className="d-flex justify-content-left pt-5 mb-4 lead">
          What they say:
        </div>

        {reviews.map((item) => (
          <div className="row rounder lead bg-default-grey my-3">
            <div className="col-12 p-2 d-sm-flex justify-content-between ">
              <div className="lead align-self-center font-weight-bold">
                <div className="p-3">
                  {item.body && (
                    <div className="d-flex justify-content-center">
                      <img
                        alt="profile"
                        className="rounded-circle d-sm-block d-none"
                        src={process.env.PUBLIC_URL + "/user-icon.svg"}
                        width={100}
                      />
                    </div>
                  )}
                  <div className="lead text-center font-weight-bold">
                    {item.user.firstname + " " + item.user.lastname}
                  </div>
                </div>
              </div>
              <div className="flex-fill">
                <div className="d-flex justify-content-sm-end justify-content-center pt-1 lead">
                  <span className="lead font-weight-bold p-0 text-pink card-text text-left">
                    {item.rating % 1
                      ? item.rating.toFixed(1)
                      : item.rating.toFixed(1)}
                  </span>
                  <span
                    className="text-pink lead ml-2"
                    style={{ width: "130px" }}
                  >
                    {Array(parseInt(item.rating))
                      .fill()
                      .map(() => (
                        <i className="fa fa-star pr-1"></i>
                      ))}
                    {item.rating !== 0 ? (
                      item.rating !== 5 ? (
                        <i
                          style={{
                            width: (item.rating % 1).toFixed(1) * 18.0 + "px",
                            overflowX: "hidden",
                            display:
                              item.rating - parseInt(item.rating)
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
                <div className="">{item.body}</div>
              </div>
            </div>
            {item.body && (
              <div className="col-12 px-sm-4 pb-2 d-sm-flex justify-content-between "></div>
            )}
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewsComponent);

import React, { Component } from "react";
import { connect } from "react-redux";
import APIService from "../../services/apiRequest.service";
// import AwesomeSlider from 'react-awesome-slider';
import "react-awesome-slider/dist/styles.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactPlayer from "react-player";

class AdminWorkshopPedningDetailComponenet extends Component {
  componentDidMount() {
    APIService.fetchLessonsForPendingWorkshop(this.props.workshop.id).then(
      (res) => {
        // console.log(res.data)
        this.setState({
          lessons: res.data,
          loading: false,
        });
      }
    );
  }
  state = {
    loading: true,
    fetching: true,
    lessons: [],
  };

  render() {
    const level = {
      Easy: "text-green",
      Medium: "text-blue",
      Difficult: "text-red",
    };

    var settings = {
      customPaging: function (i) {
        return <button className="btn-solid-link paginators">{i + 1}</button>;
      },
      dots: true,
      infinite: true,
      speed: 1300,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    return (
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-4 col-12">
            <img
              src={"http://localhost:8000" + this.props.workshop.imageUrl}
              height="200px"
              className="card-img-top rounder"
              alt="Workshop"
            />
          </div>
          <div className="col-md-4 col-12 mt-3">
            <h5>
              Title:{" "}
              <span className="text-pink">{this.props.workshop.title}</span>
            </h5>
            <h6>Category : {this.props.workshop.category}</h6>
            <h6>
              Author:{" "}
              <span className="text-pink">
                @{this.props.workshop.author.username}
              </span>
            </h6>
            <h6>
              Level:{" "}
              <span className={level[this.props.workshop.level]}>
                {this.props.workshop.level}
              </span>
            </h6>
          </div>
          <div className="col-md-4 col-12 mt-3">
            <h6>Price: $ {this.props.workshop.price}</h6>
            <h6>Created On: {this.props.workshop.created_on.split("T", 1)}</h6>
            <h6>Lessons: {this.props.workshop.no_of_lessons}</h6>
            <h6>Cost Free Lessons: {this.props.workshop.cost_free_lesson}</h6>
          </div>
        </div>
        <div className="row mt-3 ml-3">
          <h6>
            <span className="font-weight-bold">Description:</span>{" "}
            {this.props.workshop.description}
          </h6>
        </div>
        <div className="row justify-content-center mt-5">
          <h2 className="text-pink">Lessons</h2>
        </div>
        <Slider {...settings}>
          {!this.state.loading &&
            this.state.lessons.map((lesson) => (
              <div>
                <ReactPlayer
                  width="100%"
                  height="100%"
                  controls
                  url={"http://localhost:8000" + lesson.lesson_video}
                ></ReactPlayer>
                <h6>
                  Lesson {lesson.lesson_no + 1}: {lesson.lesson_title}
                </h6>
              </div>
            ))}
        </Slider>
        {/*<AwesomeSlider className="mt-5">*/}
        {/*    {!this.state.loading && this.state.lessons.map((lesson) => {*/}
        {/*        return(*/}
        {/*            <div data-src={"http://localhost:8000"+lesson.lesson_video}>*/}
        {/*            </div>*/}
        {/*        )*/}
        {/*    })*/}
        {/*    }*/}
        {/*</AwesomeSlider>*/}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminWorkshopPedningDetailComponenet);

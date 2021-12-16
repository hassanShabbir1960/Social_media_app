import React, { Component } from "react";
// import * as actions from "../../store/actions/auth";
import { connect } from "react-redux";
import HeaderComponent from "../header.component";
import $ from "jquery";
import "../../css/admin-dashboard.css";
import APIService from "../../services/apiRequest.service";
// import StaticData from "../StaticData";
// import {Link} from "react-router-dom";
import AdminWorkshopPedningDetailComponenet from "./adminWorkshopPedningDetail.componenet";

//for SPA
const SHOW_PENDING_REQUESTS = "SHOW_PENDING_REQUESTS";
const SHOW_WORKSHOPS = "SHOW_WORKSHOPS";
const SHOW_USERS = "SHOW_USERS";
const SHOW_WORKSHOP_DETAIL = "SHOW_WORKSHOP_DETAIL";

class AdminDashboardComponent extends Component {
  componentDidMount() {
    this.fetchWorkshops();
    this.JQueryCode();
  }
  fetchWorkshops = () => {
    APIService.fetchPendingWorkshops().then((res) => {
      console.log(res.data);
      this.setState({
        results: res.data,
        loading: false,
      });
    });
  };
  approveCurrentWorksop = (e) => {
    e.currentTarget.innerHTML = "Approved";
    APIService.approvePendingWorkshop(this.state.currentWorkshop.id)
      .then((res) => {
        console.log(res.data[0]);
        setTimeout(() => {
          document.getElementById("back").click();
        }, 1000);
        this.fetchWorkshops();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  rejectCurrentWorksop = (e) => {
    e.currentTarget.innerHTML = "Deleted";
    APIService.rejectPendingWorkshop(this.state.currentWorkshop.id)
      .then((res) => {
        console.log(res.data[0]);
        setTimeout(() => {
          document.getElementById("back").click();
        }, 1000);
        this.fetchWorkshops();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  JQueryCode = () => {
    $(".list-group .list-group-item").click(function (e) {
      $(".list-group .list-group-item").removeClass("active");
      $(e.target).addClass("active");
    });
  };
  state = {
    loading: true,
    fetching: true,
    results: [],
    navSelection: SHOW_PENDING_REQUESTS,
    currentWorkshop: null,
  };
  showPendingRequests = () => {
    this.setState({
      navSelection: SHOW_PENDING_REQUESTS,
      currentWorkshop: -1,
    });
  };
  showWorkshopDetails = (workshop) => {
    this.setState({
      navSelection: SHOW_WORKSHOP_DETAIL,
      currentWorkshop: workshop,
    });
  };
  showWorkshops = () => {
    this.setState({
      navSelection: SHOW_WORKSHOPS,
    });
  };
  showUsers = () => {
    this.setState({
      navSelection: SHOW_USERS,
    });
  };
  render() {
    return (
      <div>
        <div className="fixed-top">
          <HeaderComponent></HeaderComponent>
        </div>
        <div className="container-fluid row pad-nav">
          <div className="col-md-3 col-12">
            <div className="list-group">
              <button
                className="list-group-item list-group-item-action active"
                onClick={this.showPendingRequests}
              >
                Pending Requests
              </button>
              <button
                className="list-group-item list-group-item-action"
                onClick={this.showWorkshops}
              >
                Workshops
              </button>
              <button
                className="list-group-item list-group-item-action"
                onClick={this.showUsers}
              >
                Users
              </button>
            </div>
          </div>
          <div className="col-md-9 col-12">
            {/*Pending Requests Card Lists*/}
            {this.state.navSelection === SHOW_PENDING_REQUESTS &&
              !this.state.loading &&
              this.state.results.map((result) => (
                // <Link className="solid-link" to={"/workshop/" + result.id}>
                <button
                  onClick={() => this.showWorkshopDetails(result)}
                  className="card border-0
                                                    border-dark d-inline-block ml-3 mt-3 p-2 shadow-sm"
                  style={{ width: "20rem" }}
                >
                  <img
                    src={"http://localhost:8000" + result.imageUrl}
                    height="200px"
                    className="card-img-top rounder"
                    alt={"Workshop " + result.id + " Cover Image"}
                  />
                  <span className="text-pink lead card-text text-left text-overflow">
                    {result.category}
                  </span>
                  <div className="pt-2 d-flex justify-content-between">
                    <span className="lead text-default-black font-weight-bold card-text text-left text-overflow">
                      Title:{result.title}
                    </span>
                  </div>
                  <div className="pt-2 d-flex justify-content-between">
                    <span className="text-default-black font-weight-bold card-text text-left text-overflow">
                      Price: $ {result.price}
                    </span>
                  </div>
                  <div className="pt-2 d-flex justify-content-between">
                    <span className="text-default-black font-weight-bold card-text text-left text-overflow">
                      Author:
                      <span className=" text-pink">
                        @{result.author.username}
                      </span>
                    </span>
                  </div>
                  <div className="pt-2 d-flex justify-content-between">
                    <span className="text-default-black font-weight-bold card-text text-left">
                      Created on:
                      <span className=" text-pink">
                        {" "}
                        {result.created_on.split("T", 1)}
                      </span>
                    </span>
                  </div>
                </button>
                // </Link>
              ))}
            {this.state.navSelection === SHOW_WORKSHOPS && (
              <div className="ml-3">
                <h2>Workshops</h2>
              </div>
            )}
            {this.state.navSelection === SHOW_USERS && (
              <div className="ml-3">
                <h2>Users</h2>
              </div>
            )}
            {this.state.navSelection === SHOW_WORKSHOP_DETAIL && (
              <div className="ml-3">
                <nav className="navbar navbar-light bg-light justify-content-between">
                  <button
                    id="back"
                    onClick={this.showPendingRequests}
                    className="btn btn-outline-success button-pink my-2 my-sm-0"
                  >
                    back
                  </button>
                  <div>
                    <button
                      onClick={this.rejectCurrentWorksop}
                      className="btn btn-outline-success button-pink my-2 my-sm-0"
                    >
                      Delete
                    </button>
                    <button
                      onClick={this.approveCurrentWorksop}
                      className="btn btn-outline-success my-2 my-sm-0 ml-3"
                    >
                      Approve
                    </button>
                  </div>
                </nav>
                <AdminWorkshopPedningDetailComponenet
                  workshop={this.state.currentWorkshop}
                ></AdminWorkshopPedningDetailComponenet>
              </div>
            )}
          </div>
        </div>
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
)(AdminDashboardComponent);

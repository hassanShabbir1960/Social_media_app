import React, { Component } from "react";
import { connect } from "react-redux";
import StaticData from "./StaticData";
import { Link } from "react-router-dom";
import APIService from "../services/apiRequest.service";

class CreatorCard extends Component {
  toggleFollow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    APIService.ToggleFollow(this.props.oneitem.id).then(()=>{
      APIService.fetchCreators({id:this.state.oneitem.id}).then((res)=>{
        this.setState({
          oneitem: res.data[0]
        })

      })

     
    });
    this.setState({
      oneitem: {
        ...this.state.oneitem,
        followed: !this.state.oneitem.followed,
      },
    });
  };

  state = {
    oneitem: this.props.oneitem,
  };
  render() {
    const { oneitem } = this.state;
    console.log(oneitem);
    return (
      <Link className="solid-link" to={"/profile/" + oneitem.id}>
        <div className="card border rounder" style={{ width: "22rem" }}>
          <div className="text-center">
            <img
              src={
                oneitem.imageUrl
                  ? StaticData.BEURL + oneitem.imageUrl
                  : process.env.PUBLIC_URL + "/clock-icon.svg"
              }
              height={120}
              width={120}
              className="my-2 shadow rounded-circle"
              alt="profile"
            />
          </div>
          <div className="text-default-black h4 font-weight-bold card-text text-center">
            {oneitem.firstname + " " + oneitem.lastname}
          </div>
          <div className="lead text-muted card-text text-center">
            {"@" + oneitem.username}
          </div>
          <div className="px-3 pb-4 text-default-black text-truncate card-text text-center">
            {oneitem.bio + oneitem.bio}
          </div>
          <div className="dropdown-divider"></div>
          <div className=""></div>
          <div className="d-flex p-2 justify-content-around text-black-default">
            <div className="text-center font-weight-bold text-default-black">
              <div>Followers</div>
              <div className="text-pink">{oneitem.followers}</div>
            </div>
            <div className="text-center font-weight-bold solid-link text-default-black">
              <div>Following</div>
              <div className="text-pink">{oneitem.following}</div>
            </div>
            <div className="text-center ml-5">
              <button
                onClick={this.toggleFollow}
                className="btn-outline-pink solid-link btn-sm rounder d-flex justify-content-around"
              >
                {!oneitem.followed ? (
                  <div className="d-flex justify-content-around">
                    <span>
                      <i className="fa fa-plus"></i>
                    </span>
                    <span className="ml-1">Follow</span>
                  </div>
                ) : (
                  <div className="d-flex justify-content-around">
                    <span className="ml-1">Unfollow</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CreatorCard);

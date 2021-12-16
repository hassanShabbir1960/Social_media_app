import React, { Component } from "react";
import { connect } from "react-redux";
import APIService from "../services/apiRequest.service";

class HelpTopic extends Component {
  componentDidMount() {
    if (!this.props.location.state) {
      this.props.history.push("/help");
      return;
    }
    this.fetch(this.props.location.state);
  }

  fetch = (params) => {
    APIService.fetchHelpArticles(params)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        //   this.props.history.goBack()
      });
  };

  render() {
    return <div></div>;
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HelpTopic);

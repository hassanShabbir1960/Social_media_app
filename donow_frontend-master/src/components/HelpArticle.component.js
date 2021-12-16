import React, { Component } from "react";
import { connect } from "react-redux";
import validator from "validator";
import APIService from "../services/apiRequest.service";

class HelpArticle extends Component {
  componentDidMount() {
    if (!this.props.match.params || !this.props.match.params.id) {
      this.props.history.push("/help");
      return;
    }
    if (
      !validator.isNumeric(this.props.match.params.id.toString()) ||
      this.props.match.params.id < 1
    ) {
      this.props.history.push("/help");
      return;
    }
    this.fetch(this.props.match.params.id);
  }

  fetch = (id) => {
    APIService.fetchHelpArticles({ id: id })
      .then((res) => {
        this.setState({ article: res.data });
      })
      .catch((err) => {
        // console.log(err);
        this.props.history.goBack();
      });
  };

  state = {
    article: undefined,
  };

  render() {
    return <div></div>;
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HelpArticle);

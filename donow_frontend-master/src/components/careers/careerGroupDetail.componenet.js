import React, { Component } from "react";
import APIService from "../../services/apiRequest.service";
import HeaderComponent from "../header.component";
import FooterComponent from "../footer.component";
import { Link } from "react-router-dom";
export default class CareerGroupDetailComponenet extends Component {
  componentDidMount() {
    var groupName = this.props.match.params.groupName;
    APIService.fetchCareerGroups()
      .then((res) => {
        if (res.data.careers.indexOf(groupName) === -1) {
          this.props.history.push("/404");
          return;
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
    this.setState({
      loading: true,
    });
    APIService.fetchJobs(groupName)
      .then((res) => {
        // console.log(res.data)
        this.setState({
          jobs: res.data,
          loading: false,
        });
        console.log(this.state.jobs);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
  state = {
    jobs: [],
    loading: false,
  };
  render() {
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div className="mt-lg-5 w-75 m-auto">
          <h1 className="font-light">Jobs we are offering</h1>
          <h3 className="mt-5">{this.props.match.params.groupName}</h3>
          <div className="mt-5">
            {!this.state.loading &&
              this.state.jobs.length > 0 &&
              this.state.jobs.map((job) => (
                <div className="row">
                  <div className="col-md-6">
                    <h3 className="text-pink">{job.title}</h3>
                    <p>{job.location}</p>
                  </div>
                  <div className="col-md-6">
                    <Link className="div-link float-right" to="/contact">
                      Apply
                    </Link>
                  </div>
                </div>
              ))}
            {!this.state.loading && this.state.jobs.length === 0 && (
              <div style={{ marginTop: "10%" }}>
                No jobs are open as of now.
              </div>
            )}
          </div>
        </div>
        <div className="mt-5">
          <FooterComponent></FooterComponent>
        </div>
      </div>
    );
  }
}

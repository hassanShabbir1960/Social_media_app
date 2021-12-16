import React, { Component } from "react";
import {Link} from "react-router-dom";
import "../../css/static-pages.css";
import HeaderComponent from "../header.component";
import FooterComponent from "../footer.component";
import APIService from "../../services/apiRequest.service";


export default class CareerGroupsComponenet extends Component{
    componentDidMount() {
        APIService.fetchCareerGroups().then((res) => {
            this.setState({
                career_groups: res.data.careers,
            });
        }).catch(err => {
            console.log(err.response)
        })
    }

    state = {
        career_groups: []
    }
    render() {
        return(
            <div>
                <HeaderComponent></HeaderComponent>
                <div className="text-center mt-5">
                    <h1>Explore our groups</h1>
                    <p>Feel free to join what suits your interest.</p>
                </div>
                <div className="">
                    <div className="row m-0 mt-5 w-75 m-auto">
                        {this.state.career_groups.length > 0 && this.state.career_groups.map((career) => (
                            <div className="col-12 col-md-6 col-lg-4 mt-3">
                                <Link className='div-link w-75 m-auto' to={`/careers/groups/${career}`}>
                                    <div className="div-border rounded p-5" style={{wordWrap: "break-word"}}>
                                        <h2>
                                            {career}
                                        </h2>
                                        <span className="red-bar"></span>
                                        <div className="float-right mt-4">
                                            <i className="fa fa-arrow-right"></i>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        {this.state.career_groups.length === 0 &&
                            <div className="w-100 h4 mt-5 text-center">
                               No career groups Found
                            </div>}
                    </div>
                </div>
                <div className="mt-5">
                    <FooterComponent></FooterComponent>
                </div>
            </div>
        )
    }

}

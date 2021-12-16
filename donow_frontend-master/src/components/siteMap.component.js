import React, { Component } from "react";
import siteMapList from "./utilities/siteMapList";
import HeaderComponent from "./header.component";
import { Link } from "react-router-dom";
import FooterComponent from "./footer.component";

export default class SiteMapComponent extends Component {
  render() {
    // const {sitemap} = siteMapList
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div className="mt-5">
          <div className="text-sm-left text-center pl-sm-5 mb-3">
            <span>{"DoNow > "}</span>
            <Link className="text-pink" to="/discover">
              Discover
            </Link>
            <span>{" > "}</span>
            <Link className="text-pink" to="/discover/workshops">
              Workshops
            </Link>
          </div>
          <div className="display-4 text-sm-left text-center pl-sm-5 mb-5">
            Sitemap
          </div>
        </div>
        {/*<div className="mb-5 d-flex justify-content-center">*/}
        {/*    <form*/}
        {/*        onSubmit={this.onSubmit}*/}
        {/*        className="d-sm-flex d-block justify-content-center col-xl-9 col-lg-10 col-11"*/}
        {/*    >*/}
        {/*        <div className="form-group col-sm-8 col-12">*/}
        {/*            <button*/}
        {/*                type="submit"*/}
        {/*                className="btn-solid-link text-secondary fa fa-search ml-2 p-2 mt-3"*/}
        {/*                style={{*/}
        {/*                    position: "absolute",*/}
        {/*                    fontSize: "large",*/}
        {/*                    textDecoration: "none",*/}
        {/*                }}*/}
        {/*            ></button>*/}
        {/*            <input*/}
        {/*                name="searchValue"*/}
        {/*                className="form-control form-control-lg pl-5"*/}
        {/*                style={{ borderRadius: "50px", paddingBlock: "32px " }}*/}
        {/*                placeholder="Search for Workshops"*/}
        {/*                onChange={this.onChange}*/}
        {/*            />*/}
        {/*        </div>*/}
        {/*    </form>*/}
        {/*</div>*/}

        {/*Links*/}
        <div className="container">
          <div id="local-homepage" className="row">
            <div>
              <h3>Local Homepage</h3>
              <div className="mt-2">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Local_Homepage.Landing_Page}
                >
                  Landing Page
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Local_Homepage.HomePage}
                >
                  Home Page
                </Link>
              </div>
            </div>
          </div>
          <div id="login" className="row mt-5">
            <div>
              <h3>Login</h3>
              <div className="mt-2">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Login.Sign_in}
                >
                  Sign in
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Login.Sign_up}
                >
                  Sign up
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Login.Become_Creator}
                >
                  Become Creator
                </Link>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div id="profile" className="col-md-4 col-12 p-0">
              <h3>Profile</h3>
              <div className="mt-2">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Profile.Profile_Page}
                >
                  Profile Page
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Profile.Profile_Post}
                >
                  Profile Post
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Profile.Profile_Courses}
                >
                  Profile Courses
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Profile.Edit_Profile}
                >
                  Edit Profile
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Profile.View_Post}
                >
                  View Post
                </Link>
              </div>
            </div>
            <div id="individual-course" className="col-md-4 col-12 p-0">
              <h3>Individual Course</h3>
              <div className="mt-2">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Individual_Course.Main_Page}
                >
                  Main Page
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Individual_Course.About}
                >
                  About
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Individual_Course.Reviews}
                >
                  Reviews
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Individual_Course.Discussion}
                >
                  Discussion
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Individual_Course.Past_Projects}
                >
                  Past Projects
                </Link>
              </div>
            </div>
          </div>
          <div id="personal" className="row mt-5">
            <div>
              <h3>Personal Pages</h3>
              <div className="mt-2">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Personal_Pages.Favorites}
                >
                  Favorites
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Personal_Pages.Purchased_courses}
                >
                  Purchased courses
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Personal_Pages.My_cart}
                >
                  My cart
                </Link>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <h3>Payment</h3>
          </div>
          <div id="payment" className="row mt-2">
            <div id="add-payment-method" className="col-md-4 col-12 p-0">
              <h4>Add Payment Method</h4>
              <div className="mt-2">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Payment.Add_Payment_Method.CreditDebit_card}
                >
                  Credit/Debit card
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Payment.Add_Payment_Method.Paypal}
                >
                  Paypal
                </Link>
              </div>
            </div>
            <div id="withdrawal" className="col-md-4 col-12 p-0">
              <h4>Withdrawal</h4>
              <div className="mt-2">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Payment.Withdrawal.Balance}
                >
                  Balance
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Payment.Withdrawal.Withdrawal_successful}
                >
                  Withdrawal successful
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Payment.Withdrawal.Insufficient_funds}
                >
                  Insufficient funds
                </Link>
              </div>
            </div>
            <div id="invoice" className="col-md-4 col-12 p-0">
              <h4>Invoice</h4>
              <div className="mt-2">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Payment.Invoice.Payments}
                >
                  Payments
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Payment.Invoice.Withdrawn}
                >
                  Withdrawn
                </Link>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <div id="course-management" className="col-md-4 col-12 p-0">
              <h3>Course Management</h3>
              <div className="mt-2">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Course_Management.Courses}
                >
                  Courses
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Course_Management.Discussion}
                >
                  Discussion
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Course_Management.Add_new_course}
                >
                  Add new course
                </Link>
              </div>
            </div>
            <div id="workshops" className="col-md-4 col-12 p-0">
              <h3>Workshops</h3>
              <div className="mt-2">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Workshops.See_all}
                >
                  See all
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Workshops.Share}
                >
                  Share
                </Link>
              </div>
            </div>
          </div>

          <div id="discover" className="row mt-5">
            <div>
              <h3>Discover</h3>
              <div className="mt-2">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Discover.Creators}
                >
                  Creators
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Discover.Workshops}
                >
                  Workshops
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Discover.Sitemap}
                >
                  Sitemap
                </Link>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <h3>Help</h3>
          </div>
          <div id="help" className="row mt-2">
            <div id="student" className="col-md-4 col-12 p-0">
              <h4>Student</h4>
              <div className="mt-2">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Help.Student.FAQs}
                >
                  FAQs
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Help.Student.Getting_started}
                >
                  Getting started
                </Link>
              </div>

              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Help.Student.Course_enrollment}
                >
                  Course enrollment
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Help.Student.Account}
                >
                  Account/Profile
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Help.Student.Payment_process}
                >
                  Payment process
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Help.Student.Student_work}
                >
                  Student work
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Help.Student.Rating}
                >
                  Review/Rating
                </Link>
              </div>
            </div>
            <div id="instructor" className="col-md-4 col-12 p-0">
              <h4>Withdrawal</h4>
              <div className="mt-2">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Help.Instructor.FAQs}
                >
                  FAQs
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Help.Instructor.Creating_course}
                >
                  Creating course
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Help.Instructor.Course_Management}
                >
                  Course Management
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Help.Instructor.Instructor_payment}
                >
                  Instructor payment
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Help.Instructor.Instructor_profile}
                >
                  Instructor profileAQs
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Help.Instructor.Quality_standard}
                >
                  Quality standard
                </Link>
              </div>
              <div className="mt-1">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Help.Instructor.Trust_and_safety}
                >
                  Trust & safety
                </Link>
              </div>
            </div>
          </div>

          <div id="contact" className="row mt-5">
            <div className="col-md-4 col-12 p-0">
              <h3>Contact</h3>
              <div className="mt-2">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Contact.Contact_us}
                >
                  Contact us
                </Link>
              </div>
            </div>

            <div className="col-md-4 col-12 p-0">
              <h3>Careers</h3>
              <div className="mt-2">
                <Link
                  className="text-pink text-decoration-none"
                  to={siteMapList.Careers.Careers}
                >
                  Careers
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <FooterComponent></FooterComponent>
        </div>
      </div>
    );
  }
}

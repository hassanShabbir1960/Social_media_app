import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import LandingPageComponent from "./components/landingPage.component";
import LoginComponent from "./components/login.component";
import SignupComponent from "./components/signup.component";
import Alerts from "./components/layouts/alerts";
import { connect } from "react-redux";
import HomePageComponent from "./components/homePage.component";
import ProfileComponent from "./components/profile.component";
import ProfileEditComponent from "./components/profileEdit.component";
import CreateWorkshopComponent from "./components/createWorkshop.component";
import { authCheckState, loadUser } from "./store/actions/auth";
import PrivateRoute from "./components/functionalComponents/private.routes";
import VerifyEmailComponent from "./components/verifyEmail.component";
import WaitApprovalComponent from "./components/waitApproval.component";
import SearchResultsComponent from "./components/searchResults.component";
import DiscoverComponent from "./components/discover.component";
import DiscoverWorkshopsComponent from "./components/discoverWorkshops.component";
import DiscoverCreatorsComponent from "./components/discoverCreators.component";
import SiteMapComponent from "./components/siteMap.component";
import WorkshopComponent from "./components/workshop.component";
import AdminLoginComponent from "./components/admin/adminLogin.component";
import AdminDashboardComponent from "./components/admin/adminDashboard.component";
import AboutPageComponent from "./components/aboutPage.component";
import CareersComponenet from "./components/careers/careers.componenet";
import CareerGroupsComponenet from "./components/careers/careerGroups.componenet";
import CareerGroupDetailComponenet from "./components/careers/careerGroupDetail.componenet";

import Component404 from "./components/404.component";
import CoursesPanel from "./components/CoursesPanel.component";
import courseManagementComponent from "./components/courseManagement.component";
import CartComponent from "./components/cart.component";
import ContactUsComponent from "./components/contactUs.component";
import PaymentComponent from "./components/payment.component";
import AddPaymentComponent from "./components/addPayment.component";
import BalanceComponent from "./components/balance.component";
import InvoiceComponent from "./components/invoice.component";
import AdminRoute from "./components/functionalComponents/admin.routes";
import TransactionResultComponent from "./components/TransactionResult.component";
import HelpComponent from "./components/help.component";
import HelpTopicComponent from "./components/HelpTopic.component";
import HelpArticleComponent from "./components/HelpArticle.component";

class App extends Component {
  componentDidMount() {
    // console.log(this.props.isAuthenticated);
    this.props.onTryAutoSignup();
    // if(this.props.isAuthenticated){
    this.props.loadUser();
    // }
  }

  render() {
    return (
      <div className="App">
        <Alerts />
        <Switch>
          <Route path="/admin-login" exact component={AdminLoginComponent} />
          <AdminRoute path="/admin" exact component={AdminDashboardComponent} />
          {/* <Route path="/*" component={HeaderComponent} /> */}
          <Route path="/" exact component={LandingPageComponent} />
          <Route path="/login" exact component={LoginComponent} />
          <Route path="/sign-up" exact component={SignupComponent} />
          <Route path="/discover" exact component={DiscoverComponent} />
          <Route path="/about" exact component={AboutPageComponent} />
          <Route path="/contact" exact component={ContactUsComponent} />
          <Route path="/careers" exact component={CareersComponenet} />
          <Route
            path="/careers/groups"
            exact
            component={CareerGroupsComponenet}
          />
          <Route
            path="/careers/groups/:groupName"
            exact
            component={CareerGroupDetailComponenet}
          />

          <Route
            path="/discover/workshops"
            exact
            component={DiscoverWorkshopsComponent}
          />
          <Route
            path="/discover/creators"
            exact
            component={DiscoverCreatorsComponent}
          />
          <Route
              path="/discover/sitemap"
              exact
              component={SiteMapComponent}
          />
          <PrivateRoute path="/workshop/:id" component={WorkshopComponent} />
          <Route path="/verify-email" exact component={VerifyEmailComponent} />
          <Route
            path="/pending-approval"
            exact
            component={WaitApprovalComponent}
          />
          <Route
            path="/create-workshop"
            exact
            component={CreateWorkshopComponent}
          />
          <Route path="/search" exact component={SearchResultsComponent} />
          <PrivateRoute path="/home" exact component={HomePageComponent} />
          <PrivateRoute path="/profile/:id" component={ProfileComponent} />
          <PrivateRoute
            path="/edit-profile"
            exact
            component={ProfileEditComponent}
          />
          <PrivateRoute
            path="/user/course-management"
            exact
            component={courseManagementComponent}
          ></PrivateRoute>
          <PrivateRoute
            path="/user/cart/"
            exact
            component={CartComponent}
          ></PrivateRoute>
          <PrivateRoute
            path="/user/payment/"
            exact
            component={PaymentComponent}
          ></PrivateRoute>
          <PrivateRoute
            path={["/user/payment/add", "/user/payment/edit"]}
            exact
            component={AddPaymentComponent}
          ></PrivateRoute>
          <PrivateRoute
            path="/user/payment/balance"
            exact
            component={BalanceComponent}
          ></PrivateRoute>
          <PrivateRoute
            path="/user/payment/invoice"
            exact
            component={InvoiceComponent}
          ></PrivateRoute>
          <PrivateRoute
            path="/user/payment/after"
            exact
            component={TransactionResultComponent}
          ></PrivateRoute>
          <PrivateRoute
            path="/user/:location"
            exact
            component={CoursesPanel}
          ></PrivateRoute>
          <Route
            path="/help/article/:id"
            exact
            component={HelpArticleComponent}
          ></Route>
          <Route
            path="/help/topic"
            exact
            component={HelpTopicComponent}
          ></Route>
          <Route path="/help" exact component={HelpComponent}></Route>
          <Route path="/404" exact component={Component404}></Route>
          <Redirect path="*" exact to="/404"></Redirect>
        </Switch>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: localStorage.getItem("token") ? true : false,
    // isAuthenticated: state.authReducer.loggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(authCheckState()),
    loadUser: () => dispatch(loadUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

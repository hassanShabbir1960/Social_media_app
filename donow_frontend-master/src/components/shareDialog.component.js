import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
  EmailShareButton,
  TumblrShareButton,
  WhatsappShareButton,
} from "react-share";
import StaticData from "./StaticData";

export class ShareDialog extends React.Component {
  state = {
    copied: "",
  };
  copy = () => {
    navigator.clipboard.writeText(this.props.link).then(
      () => {
        this.setState({
          copied: "Copied!",
        });
        setTimeout(() => {
          this.setState({
            copied: "",
          });
        }, 2000);
      },
      function () {
        /* clipboard write failed */

        this.setState({
          copied: "Failed to Copy!",
        });
        setTimeout(() => {
          this.setState({
            copied: "",
          });
        }, 2000);
      }
    );
  };
  render() {
    return (
      <div
        className="container-fluid vh-100 text-center no-scrollbar"
        onClick={() => {
          document.onkeyup({ key: "Escape" });
        }}
        style={{
          width: "100%",
          backgroundColor: "hsla(360, 100%, 100%, 0.5)",
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: "10000",
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="card bg-light"
          style={{
            opacity: 1,
            position: "absolute",
            top: "15%",
            left: "37.5%",
            marginTop: "-50px",
            width: "25%",
            minWidth: "100px",
            borderRadius: "50px",
            boxShadow: "-5px 0px 5px lightgrey",
          }}
        >
          <div className="card-body px-md-5 py-5">
            <p className="d-none d-sm-block card-title h3 font-weight-bold mb-5">
              Share to
            </p>
            <p className="d-sm-none card-title font-weight-bold mb-5">Share</p>
            <div className="row">
              <div className="col-12 col-lg-6 text-center my-2">
                <FacebookShareButton
                  quote="Check this out on DoNow.com!"
                  hashtag="#donow"
                  className="btn btn-block btn-solid-link"
                  url={this.props.link}
                >
                  <div>
                    <img
                      alt="..."
                      src={process.env.PUBLIC_URL + "/facebook-icon.svg"}
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className="d-none d-sm-block font-weight-bold text-black-default">
                    Facebook
                  </div>
                </FacebookShareButton>
              </div>
              <div className="col-12 col-lg-6 text-center my-2">
                <TwitterShareButton
                  className="btn btn-block btn-solid-link"
                  url={this.props.link}
                  title="Check this out on DoNow.com!"
                  hashtags={["#donow"]}
                >
                  <div>
                    <img
                      alt="..."
                      src={process.env.PUBLIC_URL + "/twitter-icon.svg"}
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className="d-none d-sm-block font-weight-bold text-black-default">
                    Twitter
                  </div>
                </TwitterShareButton>
              </div>
              <div className="col-12 col-lg-6 text-center my-2">
                <PinterestShareButton
                  className="btn btn-block btn-solid-link"
                  media={StaticData.FEURL + "logo.svg"}
                  description="Check this out on DoNow.com!"
                  url={this.props.link}
                >
                  <div>
                    <img
                      alt="..."
                      src={process.env.PUBLIC_URL + "/pinterest-icon.svg"}
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className="d-none d-sm-block font-weight-bold text-black-default">
                    Pinterest
                  </div>
                </PinterestShareButton>
              </div>
              <div className="col-12 col-lg-6 text-center my-2">
                <EmailShareButton
                  className="btn btn-block btn-solid-link"
                  subject="DoNow Invite"
                  body="Check this out on DoNow.com!"
                  separator={"\n"}
                  url={this.props.link}
                >
                  <div>
                    <img
                      alt="..."
                      src={process.env.PUBLIC_URL + "/gmail-icon.svg"}
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className="d-none d-sm-block font-weight-bold text-black-default">
                    Email
                  </div>
                </EmailShareButton>
              </div>
              <div className="col-12 col-lg-6 text-center my-2">
                <TumblrShareButton
                  className="btn btn-block btn-solid-link"
                  url={this.props.link}
                  title="DoNow Invite"
                  caption="Check this out on DoNow.com!"
                >
                  <div>
                    <img
                      alt="..."
                      src={process.env.PUBLIC_URL + "/tumblr-icon.svg"}
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className="d-none d-sm-block font-weight-bold text-black-default">
                    Tumblr
                  </div>
                </TumblrShareButton>
              </div>
              <div className="col-12 col-lg-6 text-center my-2">
                <WhatsappShareButton
                  className="btn btn-block btn-solid-link"
                  url={this.props.link}
                  title="Check this out on DoNow.com!"
                  separator={"\n"}
                >
                  <div>
                    <img
                      alt="..."
                      src={process.env.PUBLIC_URL + "/whatsapp-icon.svg"}
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className="d-none d-sm-block d-none d-sm-block font-weight-bold text-black-default">
                    Whatsapp
                  </div>
                </WhatsappShareButton>
              </div>
            </div>
            <div className="mt-4">
              {this.state.copied ? (
                <div className="btn btn-sm btn-pink btn-block d-flex justify-content-sm-left justify-content-center">
                  <span className="text-truncate text-center">
                    {this.state.copied}
                  </span>
                </div>
              ) : (
                <div
                  onClick={this.copy}
                  className="btn btn-sm btn-pink btn-block d-flex justify-content-sm-left justify-content-center"
                >
                  <span className="mr-2">
                    <i className="fa fa-link"></i>
                  </span>
                  <span className="d-none d-sm-block mr-2">|</span>
                  <span className="d-none d-sm-block text-truncate text-center">
                    {this.props.link}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShareDialog;

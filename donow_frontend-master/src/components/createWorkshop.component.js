import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import FooterComponent from "./footer.component";
import HeaderComponent from "./header.component";
import { titleCase } from "title-case";
import CKEditor from "@ckeditor/ckeditor5-react";
import classicEditor from "@ckeditor/ckeditor5-build-classic";
import "../css/editor-styles.css";
import Validator from "validator";
import APIService from "../services/apiRequest.service";
import LoadingPageComponent from "./loadingPage.component";
import Loader from "react-loader-spinner";

class CreateWorkshopComponent extends Component {
  componentDidMount() {
    APIService.fetchCategories()
      .then((res) => {
        var categories = res.data.map((item) => {
          return item.cateogry_title;
        });
        this.setState({ isFetching: false, categories: [...categories] });
      })
      .catch((err) => {
        this.setState({
          isFetching: false,
          errors: {
            ...this.state.errors,
            category: "Categories could not be loaded",
          },
        });
      });
  }

  state = {
    loading: false,
    isFetching: true,
    data: {
      title: "",
      description: "",
      category: "",
      numberoflessons: 0,
      level: "",
      price: undefined,
      freelesson: undefined,
      lessons: [],
    },
    uploads: [],
    errors: {},
  };

  levels = ["Easy", "Medium", "Difficult"];

  onSubmit = (e) => {
    const { data } = this.state;
    e.preventDefault();
    e.stopPropagation();
    for (var field of e.target) {
      if (field.classList) field.classList.remove("is-invalid");
    }
    const errors = this.validate(data);
    this.setState({ errors });
    if (Object.keys(errors).length) {
      for (var key in errors) {
        if (e.target[key] && e.target[key].classList)
          e.target[key].classList.add("is-invalid");
      }
      return;
    }
    this.setState({
      data: {
        ...this.state.data,
        lessons: [...this.state.data.lessons].splice(
          0,
          this.state.data.numberoflessons
        ),
      },
      loading: true,
      uploads: Array(this.state.numberoflessons)
        .fill()
        .map(() => {
          return 0;
        }),
    });

    //starting creation and uploads
    APIService.createWorkshop(this.state.data, this.props.user)
      .then((res) => {
        console.log(res);
        var wid = res.data.pk;
        this.state.data.lessons.map((lesson, index) => {
          APIService.createLesson(wid, lesson, index)
            .then((res) => {
              this.onUpdateItem(
                { target: { name: "upload", value: 1 } },
                index
              );
            })
            .catch((err) => {
              this.onUpdateItem(
                { target: { name: "upload", value: -1 } },
                index
              );
            });
          return true;
        });
      })
      .catch((err) => {
        this.setState({
          errors: {
            ...this.state.errors,
            creation: "Some error occured during creation",
          },
          uploads: [],
          loading: false,
        });
      });
  };

  validate = (data) => {
    const errors = {};
    if (!data.title) {
      errors.title = "Field cannot be empty!";
    }
    if (!data.description) {
      errors.description = "Field cannot be empty!";
    }
    if (!data.category) {
      errors.category = "Field cannot be empty!";
    }
    if (!data.numberoflessons) {
      errors.numberoflessons = "Field cannot be empty!";
    }
    if (!data.level) {
      errors.level = "Field cannot be empty!";
    }
    if (!data.price || !Validator.isCurrency(data.price)) {
      errors.price = "Please enter a valid price!";
    }
    if (!data.coverurl) {
      errors.coverurl = "Cover Image cannot be empty!";
    }
    if (
      data.freelesson &&
      (!Validator.isNumeric(data.freelesson) ||
        data.freelesson < 1 ||
        data.freelesson > data.numberoflessons)
    ) {
      errors.freelesson = "Please enter a valid lesson number!";
    }
    for (var i = 0; i < data.numberoflessons; i++) {
      var lesson = data.lessons[i];
      if (!lesson.lessonname || !lesson.videourl) {
        errors.lessons = "Please provide a name and video for each lesson!";
        break;
      }
    }
    return errors;
  };

  onChange = (e) => {
    if (e.target.name === "title") e.target.value = titleCase(e.target.value);
    if (e.target.type === "file") {
      this.setState({
        data: {
          ...this.state.data,
          [e.target.name]: e.target.files[0],
        },
      });
    } else {
      this.setState({
        data: { ...this.state.data, [e.target.name]: e.target.value },
      });
    }
  };

  onUpdateItem = (e, i) => {
    if (e.persist) e.persist();
    this.setState((state) => {
      const lessons = [...state.data.lessons];
      if (e.target.name === "videourl") {
        lessons[i][e.target.name] = e.target.files[0];
        lessons[i].videoname = e.target.files[0].name;
      } else if (e.target.name === "lessonname") {
        lessons[i][e.target.name] = titleCase(e.target.value);
      } else if (e.target.name === "upload") {
        const uploads = [...state.uploads];
        uploads[i] = e.target.value;
        return {
          uploads: [...uploads],
        };
      }

      return {
        data: { ...this.state.data, lessons: [...lessons] },
      };
    });
  };

  onClick = (e) => {
    if (e.persist) e.persist();
    this.setState((state) => {
      if (
        e.target.id === "numberoflessons" &&
        parseInt(e.target.innerText) > state.data.lessons.length
      ) {
        return {
          data: {
            ...this.state.data,
            lessons: this.state.data.lessons.concat(
              Array(parseInt(e.target.innerText))
                .fill()
                .map(function () {
                  return {
                    lessonname: "",
                    videourl: "",
                    videoname: "",
                  };
                })
            ),
            numberoflessons: e.target.innerText,
          },
        };
      } else {
        return {
          data: { ...this.state.data, [e.target.id]: e.target.innerText },
        };
      }
    });
  };

  render() {
    const { isFetching, categories, data, errors, uploads } = this.state;
    if (
      uploads.length &&
      uploads.reduce((a, b) => {
        return a !== 0 && b !== 0;
      })
    ) {
      this.setState({ loading: false });
      return <Redirect to="/pending-approval"></Redirect>;
    }
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div className="container mb-5">
          {isFetching && <LoadingPageComponent></LoadingPageComponent>}
          <h2 className="text-default-black mt-5">Become a Creator Today!</h2>
          <h4 className="text-pink">Create your own workshop.</h4>
          <div className="w-25 bg-grey mt-4" style={{ height: "1px" }}></div>
          <form onSubmit={this.onSubmit}>
            <div className="form-row">
              <div className="col-2"></div>
              <div className="col-md-8 col-12">
                <label className="mt-4 text-pink font-weight-bold">
                  Title of workshop
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg px-4"
                  style={{ borderRadius: "30px" }}
                  name="title"
                  placeholder="Enter Title"
                  onChange={this.onChange}
                  value={data.title}
                />
                <div>
                  <small className="text-danger w-100">{errors.title}</small>
                </div>

                <label className="mt-4 text-pink font-weight-bold">
                  Description
                </label>
                <div
                  className="border border-mute"
                  style={{ borderRadius: "30px" }}
                >
                  <CKEditor
                    editor={classicEditor}
                    data={data.description}
                    name="description"
                    onChange={(e, editor) => {
                      this.onChange({
                        target: {
                          value: editor.getData(),
                          name: "description",
                        },
                      });
                    }}
                    onInit={(editor) => {}}
                    config={{
                      placeholder: "Define your workshop with suitable bio",
                      plugins: [
                        "Essentials",
                        "Bold",
                        "Italic",
                        "Link",
                        "List",
                        "Heading",
                        "Image",
                        "ImageUpload",
                        "Paragraph",
                      ],
                      toolbar: [
                        "heading",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "imageUpload",
                      ],
                      heading: {
                        options: [
                          {
                            model: "heading3",
                            view: "h3",
                            title: "Heading",
                            className: "ck-heading_heading3",
                          },
                          {
                            model: "paragraph",
                            title: "Paragraph",
                            className: "ck-heading_paragraph",
                          },
                        ],
                      },
                    }}
                  ></CKEditor>
                </div>
                <small className="text-danger w-100">
                  {errors.description}
                </small>
              </div>
            </div>
            <div className="form-row">
              <div className="col-2"></div>
              <div className="col-md-4 col-12">
                <label className="mt-4 text-pink font-weight-bold">
                  Category of workshop
                </label>

                <div className="dropdown w-100">
                  <button
                    className="btn btn-block btn-lg border border-mute d-flex justify-content-between"
                    type="button"
                    style={{ borderRadius: "30px" }}
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="text-default-black">
                      {data.category ? data.category : "Select Category"}
                    </span>
                    <i
                      className="text-default-black fa fa-caret-down"
                      style={{ fontSize: "30px" }}
                    ></i>
                  </button>
                  <ul
                    className="dropdown-menu w-100 pt-3 border-top-0"
                    aria-labelledby="dropdownMenuButton"
                  >
                    {!isFetching &&
                      categories.map((item) => (
                        <li
                          key={item}
                          className="btn btn-link font-weight-bold dropdown-item"
                          onClick={this.onClick}
                          id="category"
                        >
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>
                <small className="text-danger w-100">{errors.category}</small>
              </div>
              <div className="col-md-4 col-12">
                <label className="mt-4 text-pink font-weight-bold">
                  Number of Lessons
                </label>
                <div className="dropdown w-100">
                  <button
                    className="btn btn-block btn-lg border border-mute d-flex justify-content-between"
                    type="button"
                    style={{ borderRadius: "30px" }}
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="text-default-black">
                      {data.numberoflessons
                        ? data.numberoflessons
                        : "Select Lessons"}
                    </span>
                    <i
                      className="text-default-black fa fa-caret-down"
                      style={{ fontSize: "30px" }}
                    ></i>
                  </button>
                  <ul
                    className="dropdown-menu w-100 pt-3 border-top-0"
                    aria-labelledby="dropdownMenuButton"
                  >
                    {Array(10)
                      .fill()
                      .map((item, i) => (
                        <li
                          key={i + 1}
                          className="btn btn-link font-weight-bold dropdown-item"
                          onClick={this.onClick}
                          id="numberoflessons"
                        >
                          {i + 1}
                        </li>
                      ))}
                  </ul>
                </div>
                <small className="text-danger w-100">
                  {errors.numberoflessons}
                </small>
              </div>
            </div>
            <div className="form-row">
              <div className="col-2"></div>
              <div className="col-md-4 col-12">
                <label className="mt-4 text-pink font-weight-bold">
                  Level of Course
                </label>
                <div className="dropdown w-100">
                  <button
                    className="btn btn-block btn-lg border border-mute d-flex justify-content-between"
                    type="button"
                    style={{ borderRadius: "30px" }}
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="text-default-black">
                      {data.level ? data.level : "Select Level"}
                    </span>
                    <i
                      className="text-default-black fa fa-caret-down"
                      style={{ fontSize: "30px" }}
                    ></i>
                  </button>
                  <ul
                    className="dropdown-menu w-100 pt-3 border-top-0"
                    aria-labelledby="dropdownMenuButton"
                  >
                    {this.levels.map((item) => (
                      <li
                        key={item}
                        className="btn btn-link font-weight-bold dropdown-item"
                        onClick={this.onClick}
                        id="level"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <small className="text-danger w-100">{errors.level}</small>
                </div>
                <label className="mt-4 text-pink font-weight-bold">Price</label>
                <div>
                  <span className="position-absolute py-2 pl-4 lead text-grey font-weight-bold">
                    $
                  </span>
                  <input
                    style={{ borderRadius: "30px" }}
                    type="number"
                    className="form-control form-control-lg pl-5 px-4"
                    min="10"
                    step="0.01"
                    name="price"
                    value={data.price}
                    onChange={(e) => {
                      const re = /^[0-9]+(.[0-9]{1,2})?$/;
                      if (e.target.value === "" || re.test(e.target.value)) {
                        this.onChange(e);
                      } else {
                        e.target.value = data.price;
                      }
                    }}
                    placeholder="Price"
                  />
                  <small className="text-danger w-100">{errors.price}</small>
                </div>
                <label className="mt-4 text-pink font-weight-bold">
                  Cost Free Lesson
                </label>
                <input
                  type="number"
                  className="form-control form-control-lg px-4"
                  style={{ borderRadius: "30px" }}
                  name="freelesson"
                  value={data.freelesson}
                  onChange={(e) => {
                    if (
                      e.target.value === "" ||
                      (e.target.value > 0 &&
                        e.target.value <= data.numberoflessons)
                    ) {
                      this.onChange(e);
                    }
                  }}
                  placeholder="Enter Lesson Number"
                />
                <small className="text-danger w-100">{errors.freelesson}</small>
              </div>
              <div className="col-md-4 col-12">
                <div
                  className="bg-grey shadow border border-mute text-center mt-4 rounder"
                  style={{ height: "200px", overflow: "hidden" }}
                >
                  <label
                    className="text-secondary"
                    style={{ cursor: "pointer" }}
                  >
                    {!data.coverurl && (
                      <div
                        className="w-100 mt-3 font-weight-bold position-absolute"
                        style={{ left: "0px" }}
                      >
                        <div>Add cover image</div>
                        <div className="display-1 text-dark">+</div>
                      </div>
                    )}
                    <input
                      type="file"
                      name="coverurl"
                      accept="image/jpeg, image/png"
                      className="d-none"
                      onChange={this.onChange}
                    />
                    <img
                      alt=""
                      src={data.coverurl && URL.createObjectURL(data.coverurl)}
                      style={{ width: "100%" }}
                      className="border border-mute"
                    ></img>
                  </label>
                </div>
                <small className="text-danger w-100">{errors.coverurl}</small>
              </div>
              <div className="col-2"></div>
            </div>
            <div className="form-row">
              <div className="col-2"></div>
              <div className="col-md-8 text-default-black mt-5">
                <div className="lead font-weight-bold">
                  Order the videos in sequence
                </div>
                <div>
                  <small>*Enter the lesson number in ascending order</small>
                </div>
                <div className="w-100 mb-4">
                  <small className="text-danger w-100">{errors.lessons}</small>
                  {Array(
                    data.numberoflessons ? parseInt(data.numberoflessons) : 0
                  )
                    .fill()
                    .map((item, i) => (
                      <div className="row mt-4">
                        <input
                          style={{ borderRadius: "30px" }}
                          className="form-control form-control-lg col-12 col-sm-6 col-lg-5 px-4"
                          name="lessonname"
                          value={
                            data.lessons.length > i
                              ? data.lessons[i].lessonname
                              : ""
                          }
                          onChange={(e) => {
                            this.onUpdateItem(e, i);
                          }}
                          placeholder={"Lesson Number " + (i + 1).toString()}
                        />
                        <label
                          style={{ cursor: "pointer" }}
                          className="text-right col-12 col-sm-6 col-lg-7 d-flex align-items-center justify-content-end"
                        >
                          <input
                            type="file"
                            name="videourl"
                            accept="video/*"
                            className="d-none"
                            onChange={(e) => {
                              this.onUpdateItem(e, i);
                            }}
                          />

                          {uploads.length > 0 && uploads[i] < 0 && (
                            <i
                              className="mr-3 fa fa-times-circle text-danger"
                              style={{ fontSize: "25px" }}
                            ></i>
                          )}
                          {uploads.length > 0 && uploads[i] === 0 && (
                            <Loader
                              className="mr-3"
                              type="Oval"
                              color="#cd3333"
                              width={20}
                              height={20}
                            ></Loader>
                          )}

                          {uploads.length > 0 && uploads[i] > 0 && (
                            <i
                              className="mr-3 fa fa-check-circle text-pink"
                              style={{ fontSize: "25px" }}
                            ></i>
                          )}
                          <span
                            className={
                              !data.lessons[i].videoname && "font-weight-bold"
                            }
                          >
                            {data.lessons[i].videoname
                              ? data.lessons[i].videoname
                              : "Upload Video"}
                          </span>
                          <i
                            className="fa fa-paperclip text-pink ml-3 mt-1"
                            style={{
                              fontSize: "40px",
                              transform: "rotateY(180deg)",
                            }}
                          ></i>
                        </label>
                      </div>
                    ))}
                </div>
                <button
                  disabled={data.numberoflessons >= 10}
                  className="btn btn-sm btn-pink rounder p-2 px-3"
                  type="button"
                  onClick={() => {
                    if (data.numberoflessons < 10) {
                      this.onClick({
                        target: {
                          id: "numberoflessons",
                          innerText: parseInt(data.numberoflessons) + 1,
                        },
                      });
                    }
                  }}
                >
                  Add field
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div>
                <button
                  className="btn btn-pink btn-block btn-lg rounder"
                  type="submit"
                >
                  <div className="d-flex justify-content-between">
                    <div>Create</div>
                    {this.state.loading && (
                      <Loader
                        className="ml-3"
                        type="TailSpin"
                        color="#cd9999"
                        height={20}
                        width={20}
                      />
                    )}
                  </div>
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <small className="text-danger">{errors.creation}</small>
            </div>
            <div className="d-flex justify-content-center">
              <div>
                Not a Member yet?{" "}
                <Link to="/sign-up" className="alert-link text-default-black">
                  Sign up
                </Link>{" "}
                here.
              </div>
            </div>
          </form>
        </div>
        <FooterComponent></FooterComponent>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.user.id,
  };
};

export default connect(mapStateToProps)(CreateWorkshopComponent);

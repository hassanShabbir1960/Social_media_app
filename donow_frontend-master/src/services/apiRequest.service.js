import axios from "axios";
import StaticData from "../components/StaticData";
const API_URL = StaticData.BEURL;
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

let request = (method, extension, data = null, extraArgs = null) => {
  let token = localStorage["token"];
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }
  if (method === "post") {
    return axios.post(API_URL + extension, data, config);
  } else if (method === "get") {
    if (data != null) {
      return axios.get(API_URL + extension + "?data=" + data, config);
    } else {
      return axios.get(API_URL + extension, config);
    }
  } else if (method === "delete") {
    if (data != null) {
      return axios.delete(API_URL + extension + "?data=" + data, config);
    } else {
      return axios.delete(API_URL + extension, config);
    }
  } else if (method === "put" && extraArgs !== null) {
    return axios.put(API_URL + extension + "?data=" + data, extraArgs, config);
  }
};

let editUserDetails = (data) => {
  console.log(data);
  let params = new FormData();
  params.append("username", data.username);
  params.append("first_name", data.first_name);
  params.append("last_name", data.last_name);
  params.append("bio", data.bio);
  params.append("age", data.age);
  params.append("location", data.location);
  params.append("email", data.email);
  params.append("profile_image", data.image_file ? data.image_file : null);
  params.append("new_password", data.new_password1 ? data.new_password1 : "");
  params.append("facebook_profile", data.facebook_profile);
  params.append("instagram_profile", data.instagram_profile);
  params.append("youtube_profile", data.youtube_profile);
  params.append("pinterest_profile", data.pinterest_profile);
  params.append("twitter_profile", data.twitter_profile);
  return request("post", "/user_details/update/", params);
};
let fetchUser = () => {
  return request("get", "/auth/rest-auth/user");
};

let fetchUserDetails = (id = null) => {
  return request("get", "/user_details/", id);
};

let validatePassword = (password) => {
  let data = {
    password: password,
  };
  return request("post", "/user_details/password_validation/", data);
};

let validateUsername = (username) => {
  return request("get", "/user_details/username_validation/", username);
};

let validateEmail = (email) => {
  return request("get", "/user_details/email_validation/", email);
};

let fetchCareerGroups = () => {
  return request("get", "/contact_us/get_career_groups/");
};
let fetchJobs = (career) => {
  return request("get", "/contact_us/get_jobs/", career);
};

let createContactUsRecord = (data) => {
  let item = new FormData();
  item.append("email", data.email);
  item.append("subject", data.subject);
  item.append("description", data.description);
  item.append("issue", data.issue);
  data.attachments.map((file, index) => {
    item.append("attachment" + index.toString(), file);
    return null;
  });
  item.append("attachment_length", data.attachments.length);
  console.log(item["attachment_length"]);
  return request("post", "/contact_us/create_contact_form/", item);
};

//Admin Requests
let fetchPendingWorkshops = () => {
  return request("get", "/admin-react/pending-workshops/");
};

let fetchLessonsForPendingWorkshop = (id) => {
  return request("get", "/admin-react/get-lessons/", id.toString());
};

let approvePendingWorkshop = (id) => {
  let data = {
    id: id,
  };
  return request("post", "/admin-react/approve-workshop/", data);
};
let rejectPendingWorkshop = (id) => {
  return request("delete", "/admin-react/reject-workshop/", id.toString());
};

/////

let fetchCategories = () => {
  return request("get", "/workshop/fetchCategories/");
};

let createWorkshop = (workshop, user) => {
  // console.log(workshop.coverurl)
  let form_data = new FormData();
  form_data.append("title", workshop.title);
  form_data.append("description", workshop.description);
  form_data.append("category", workshop.category);
  form_data.append("no_of_lessons", workshop.numberoflessons);
  form_data.append("level", workshop.level);
  form_data.append("price", workshop.price);
  form_data.append("cost_free_lesson", workshop.freelesson);
  form_data.append("cover_image_path", workshop.coverurl);
  form_data.append("user", user);
  return request("post", "/workshop/list/", form_data);
};

let createLesson = (wid, lesson, index) => {
  // console.log(lesson.videourl)
  let lesson_data = new FormData();
  lesson_data.append("workshop_id", wid);
  lesson_data.append("lesson_title", lesson.lessonname);
  lesson_data.append("lesson_no", index);
  lesson_data.append("lesson_video", lesson.videourl);
  return request("post", "/workshop/lesson/", lesson_data);
};

let fetchSuggestions = (search_param) => {
  return request(
    "get",
    "/workshop/search",
    JSON.stringify({ search: search_param })
  );
};
///add price in search params for search results with less than price. sorry for english
//add batch in search params to get reuslts with specific page number. 24 items per page.
let fetchWorkshops = (search_params) => {
  return request("get", "/workshop/list", JSON.stringify(search_params));
};
// add batch in data. if batch no found then batch =0
let fetchCreators = (search_params) => {
  return request(
    "get",
    "/workshop/fetchCreators",
    JSON.stringify(search_params)
  );
};

let fetchFavorites = (search_params) => {
  search_params = JSON.stringify(search_params);
  return request("get", "/workshop/favorite/", search_params);
};

let fetchPurchased = (search_params) => {
  search_params = JSON.stringify(search_params);
  return request("get", "/workshop/purchased/", search_params);
};

// workshop->workshop id, user=> user id & add=1 for add and 0 for del
let addremovePurchased = (user, workshop, add) => {
  let form_data = new FormData();
  form_data.append("user", user);
  form_data.append("workshop", workshop);
  form_data.append("add", add);
  return request("post", "/workshop/purchased/", form_data);
};

let ToggleFavorites = (user, workshop) => {
  let form_data = new FormData();
  form_data.append("user", user);
  form_data.append("workshop", workshop);
  return request("post", "/workshop/favorite/", form_data);
};

// data={"searchType":Workshop | Parent | Post, searchValue: id of respective}
let fetchDiscussions = (search_params) => {
  return request("get", "/workshop/discussions", JSON.stringify(search_params));
};

let AddDiscussion = (Discussion, type) => {
  let formData = FormData();
  formData.append("body", Discussion.workshop_id);
  formData.append("user_id", Discussion.user_id);
  if (type === "post") {
    formData.append("post_id", Discussion.post_id);
  }
  if (type === "workshop") {
    formData.append("workshop_id", Discussion.workshop_id);
  }
  if (type === "parent_comment") {
    formData.append("parent_comment", Discussion.parent_comment);
  }

  return request("post", "/workshop/discussions/", formData);
};
let searchWorkshopbyCategory = (category_name) => {
  let data = {
    category: category_name,
  };
  let data_string = JSON.stringify(data);
  return request("get", "/workshop/list", data_string);
};

let searchWorkshopbyTitle = (title) => {
  let data = {
    title: title,
  };
  let data_string = JSON.stringify(data);
  return request("get", "/workshop/list", data_string);
};

let fetchWorkshopByID = (id, selfid) => {
  return request("get", `/workshop/id/${id}/${selfid}`, null);
};

// REVIEW FUNCTIONSS START
let AddReview = (workshop_id, user_id, body, rating) => {
  let formData = FormData();
  formData.append("workshop", workshop_id);
  formData.append("user", user_id);
  formData.append("body", body);
  formData.append("rating", rating);
  return request("post", "/workshop/review/", formData);
};

let GetReviews = (params) => {
  var data = JSON.stringify(params);
  return request("get", "/workshop/review/", data);
};

let DeleteReview = (id) => {
  //send a delete request at same url as get function above with id.
  //delete not handled in request function .TODO
};
///REVIEW END

// POST FUNCTIONSS START
let AddPost = (user_id, description, post_img, rating) => {
  let formData = FormData();
  formData.append("description", description);
  formData.append("user", user_id);
  formData.append("post_img", post_img);
  formData.append("rating", rating);
  return request("post", "/workshop/post/", formData);
};
let GetPosts = (params) => {
  var data = JSON.stringify(params);
  return request("get", "/workshop/post/", data);
};
let MakeInvoice = (amount, type, course, addon) => {
  let formData = FormData();
  formData.append("amount", amount);
  formData.append("type", type);
  if (type === "purchase") {
    formData.append("workshop", course);
    formData.append("add_on", addon);
  }
  return request("post", "/workshop/invoices/", formData);
};

let FetchInvoices = (params) => {
  var data = JSON.stringify(params);
  return request("get", "/workshop/invoices/", data);
};

let DeletePost = (id) => {
  //send a delete request at same url as get function above with id.
  //delete not handled in request function .TODO
};
///REVIEW END

//Payment

let AddPayment = (payment) => {
  let formData = new FormData();
  formData.append("payment", payment.payment);
  if (payment.payment === "paypal") formData.append("email", payment.email);
  else if (payment.payment === "visa") {
    formData.append("security_code", payment.securitycode);
    formData.append("expiration_date", payment.expirationdate.toISOString());
    formData.append("card_number", payment.cardnumber);
  }

  return request("post", "/workshop/payment/", formData);
};

//params must have an id. and all other attributes that needs to be updated.
let updatePayemnt = (payment) => {
  let formData = {
    id: payment.id,
    payment: payment.payment,
  };
  if (payment.payment === "paypal") formData.email = payment.email;
  else if (payment.payment === "visa") {
    formData.security_code = payment.securitycode;
    formData.expiration_date = payment.expirationdate;
    formData.card_number = payment.cardnumber;
  }

  return request("put", "/workshop/payment", JSON.stringify(payment));
};
//params=> data:{user:id}
let fetchPayments = (search_params) => {
  return request("get", "/workshop/payment", JSON.stringify(search_params));
};
let deletePayment = (params) => {
  return request("delete", "/workshop/payment", JSON.stringify(params));
};
//returns the balance of user making the request.
//undefined behaviour for log out. DO NOT USE WHEN LOGGED OUT.
let getBalance = () => {
  return request("get", "/workshop/balance");
};

//HELP ARTICLES REQUESTS
let createHelpArticle = (data) => {
  let form_data = new FormData();
  form_data.append("article_type", data.type);
  form_data.append("topic", data.topic);
  form_data.append("title", data.title);
  form_data.append("body", data.body);
  return request("post", "/workshop/help_articles/", form_data);
};
// search_params:{type|id|topic}
//only id returns body
let fetchHelpArticles = (search_params) => {
  return request(
    "get",
    "/workshop/help_articles",
    JSON.stringify(search_params)
  );
};
//provide id in params
let deleteHelpArticle = (params) => {
  return request("delete", "/workshop/help_article", JSON.stringify(params));
};
//END OF HELP
//Follow:
let ToggleFollow = (userid) => {
  return request("get", `/workshop/follow/${userid}/`);
};

//Likes
let ToggleDiscussionLikes = (discussion) => {
  return request("get", `/workshop/like_discussion/${discussion}`);
};
let TogglePostLikes = (post) => {
  return request("get", `/workshop/like_post/${post}`);
};

//EXPORTING SERVICE FUNCTIONS
const APIService = {
  request,

  //user
  fetchUserDetails,
  editUserDetails,
  fetchUser,
  validatePassword,
  validateUsername,
  validateEmail,
  getBalance,

  //workshops
  fetchCategories,
  fetchSuggestions,
  createWorkshop,
  createLesson,
  fetchFavorites,
  fetchPurchased,
  fetchWorkshops,
  fetchCreators,
  fetchWorkshopByID,
  searchWorkshopbyCategory,
  searchWorkshopbyTitle,
  addremovePurchased,
  ToggleFavorites,

  //Discussions
  fetchDiscussions,

  //Reviews
  AddReview,
  GetReviews,
  DeleteReview,

  //Posts
  AddPost,
  GetPosts,
  DeletePost,
  createContactUsRecord,

  //careers
  fetchCareerGroups,
  fetchJobs,

  //Admin Requests
  fetchPendingWorkshops,
  fetchLessonsForPendingWorkshop,
  approvePendingWorkshop,
  rejectPendingWorkshop,

  //invoices
  MakeInvoice,
  FetchInvoices,

  //payment
  AddPayment,
  fetchPayments,
  deletePayment,
  updatePayemnt,

  //help articels
  createHelpArticle,
  fetchHelpArticles,
  deleteHelpArticle,
  //follow
  ToggleFollow,
  //likes
  ToggleDiscussionLikes,
  TogglePostLikes,
  AddDiscussion,
};
export default APIService;

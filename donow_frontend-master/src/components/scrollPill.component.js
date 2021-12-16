import React from "react";

export const ScrollPill = () => {
  return (
    <div
      className="rounder bg-pink scroll-pill"
      onMouseDown={onMouseDown}
      style={{
      }}
    ></div>
  );
};

const onMouseDown = (e) => {
  e = e || window.event;
  var start = 0,
    diff = 0;
  if (e.pageY) start = e.pageY;
  else if (e.clientY) start = e.clientY;
  var scrollTopIntiial = e.target.parentNode.scrollTop;

  //   elem.style.position = "relative";
  document.body.onmousemove = function (e) {
    e = e || window.event;
    var end = 0;
    if (e.pageY) end = e.pageY;
    else if (e.clientY) end = e.clientY;
    diff = end - start;
    diff =
      (parseFloat(diff) / (e.target.parentNode.offsetHeight * 1.1)) *
      (e.target.parentNode.scrollHeight * 1.1 -
        e.target.parentNode.offsetHeight);
    console.log(diff);
    console.log(e.target.parentNode.scrollTop);
    e.target.parentNode.scrollTop = scrollTopIntiial + diff;
  };
  document.body.onmouseup = function (e) {
    // do something with the action here
    // elem has been moved by diff pixels in the X axis
    document.body.onmousemove = document.body.onmouseup = null;
  };
};

export const ScrollPillonScroll = (e) => {
  var scrollPill = document.querySelector(".scroll-pill");
  scrollPill.style.top =
    (
      (parseFloat(e.target.scrollTop) /
        parseFloat(e.target.scrollHeight - e.target.offsetHeight)) *
      113
    ).toString() + "%";
};

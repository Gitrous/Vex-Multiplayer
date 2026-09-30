// sdk/LoaderHelper.js — recovered from webpack module #52 of the original vex7.min.js
"use strict";

function LoaderHelper() {}

Object.defineProperty(exports, "__esModule", { value: true });

exports.LoaderHelper = undefined;

LoaderHelper.show = function () {
  var t = document.getElementById("loader");
  if (t) {
    t.style.display = "block";
  }
};

LoaderHelper.hide = function () {
  var t = document.getElementById("loader");
  if (t) {
    t.style.display = "none";
  }
};

exports.LoaderHelper = LoaderHelper;

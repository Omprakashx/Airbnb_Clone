const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync.js");
//const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const Review = require("../models/Review.js");
const reviewController = require("../controllers/reviews.js");

//Reviews Post Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Review Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;

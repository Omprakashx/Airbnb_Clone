const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("./listing/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listing/new.ejs");
};



module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
   .populate({
     path: "reviews",
    populate: {
      path: "author",
    },
  })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing Does Not Exist!!");
    res.redirect("/listings");
  }
  res.render("./listing/show.ejs", { listing });
};




module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  //console.log(savedListing);
  req.flash("success", "New Listing Created!!");
  res.redirect("/listings");
};



module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listings you requested for does not exist! ");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("./listing/edit.ejs", { listing, originalImageUrl });
};



module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  //console.log(id)
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    //console.log(filename);
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!!");
  res.redirect(`/listings/${id}`);
};



module.exports.destroy = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!!");
  res.redirect("/listings");
};

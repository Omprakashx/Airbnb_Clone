const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

//DB Connection
main()
  .then(() => {
    console.log("Connected with DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "65e751519300fea98d88c5dc",
  }));
  await Listing.insertMany(initdata.data);
  console.log("data was intialized");
};

initDB();

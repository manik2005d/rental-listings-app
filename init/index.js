const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

main();

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68b8414a0d41ddf21656da5d"}));
    await Listing.insertMany(initData.data);
    console.log("Data was inititalized");
}

initDB();
const mongoose = require("mongoose");

const listingSchema  = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image:  {
        type: String,
        set: (v) => v==="" ? "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60": v,
    },
    price:  {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Review",
    }]
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;
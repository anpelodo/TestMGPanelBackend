const mongoose = require("mongoose");
const { Schema } = mongoose;

const subscriberSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    require: true,
  },
  creationDate: {
    type: Date,
    require: true,
  },
});

const Subscriber = mongoose.model("Subscriber", subscriberSchema);
Subscriber.createCollection();

module.exports = Subscriber;

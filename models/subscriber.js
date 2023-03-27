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

subscriberSchema.statics.emailExist = async function (email) {
  const val = await this.find({ email })
    .countDocuments()
    .catch(() => {
      return false;
    });

  return val > 0;
};

subscriberSchema.statics.idExist = async function (id) {
  const val = await this.findById(id)
    .exec()
    .catch(() => null);
  return val != null;
};

const Subscriber = mongoose.model("Subscriber", subscriberSchema);
Subscriber.createCollection();

module.exports = Subscriber;

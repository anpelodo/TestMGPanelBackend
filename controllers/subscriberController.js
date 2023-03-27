const Subscriber = require("../models/subscriber");

const sendErrorMsg = (error, res) => {
  return res.status(500).json({
    status: 500,
    payload: {
      message: "Something happens",
      error,
    },
  });
};

module.exports = {
  async list(req, res) {
    const pageSize = Math.max(req.body.pageSize || req.query.pageSize || 10, 1);
    let page = Math.max(req.body.page || req.query.page || 1, 1);

    try {
      const totalSubscribers = await Subscriber.find().estimatedDocumentCount();
      const numberOfPages = Math.floor(totalSubscribers / pageSize) + 1;

      const subscribers = await Subscriber.find()
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      return res.status(200).json({
        status: 200,
        payload: {
          numberOfPages,
          page,
          totalSubscribers,
          subscribers,
        },
      });
    } catch (error) {
      sendErrorMsg(error, res);
    }
  },

  async add(req, res) {
    let { email, name, creationDate } = req.body;

    if (!creationDate) creationDate = new Date();

    // TODO Use correct HTTP status code
    if (!email || !name) {
      return res.status(400).json({
        status: 400,
        payload: {
          message: "'email' and 'name' are obligatory",
          email,
          name,
        },
      });
    }

    // TODO Use correct HTTP status code
    if (await Subscriber.emailExist(email)) {
      return res.status(400).json({
        status: 400,
        payload: {
          message: "This email already exist:",
          email,
        },
      });
    }

    const subscriber = await Subscriber.create({
      email,
      name,
      creationDate,
    }).catch((error) => {
      return sendErrorMsg(error, res);
    });

    return res.status(200).json({
      status: 200,
      payload: subscriber,
    });
  },

  async delete(req, res) {
    const { _id } = req.body;

    // TODO Use correct HTTP status code
    if (!_id) {
      return res.status(400).json({
        status: 400,
        payload: {
          message: "_id is mandatory",
        },
      });
    }

    if (!(await Subscriber.idExist(_id))) {
      // TODO Use correct HTTP status code
      return res.status(400).json({
        status: 400,
        payload: {
          message: "this id isn't valid or doesn't exist",
          _id,
        },
      });
    }

    const deleted = await Subscriber.findByIdAndDelete(_id).catch((error) => {
      sendErrorMsg(error, res);
    });

    return res.status(200).json({
      status: 200,
      payload: {
        message: "Deleted",
        deleted,
      },
    });
  },

  async update(req, res) {},
};

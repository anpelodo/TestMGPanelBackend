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

    return res.status(201).json({
      status: 201,
      payload: subscriber,
    });
  },

  async delete(req, res) {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        status: 400,
        payload: {
          message: "_id doesn't exist",
        },
      });
    }

    if (!(await Subscriber.idExist(_id))) {
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
        deleted,
      },
    });
  },

  async update(req, res) {
    let { _id, email, name } = req.body;

    console.log({ email }, { name });

    if (!email && !name) {
      return res.status(400).json({
        status: 400,
        payload: {
          message: "email and name doesn't exist",
        },
      });
    }

    if (!_id) {
      return res.status(400).json({
        status: 400,
        payload: {
          message: "_id doesn't exist",
        },
      });
    }

    if (!(await Subscriber.idExist(_id))) {
      return res.status(400).json({
        status: 400,
        payload: {
          message: "this id isn't valid or doesn't exist",
          _id,
        },
      });
    }

    // In case of sending the same email of the subscriber
    // in other words, the email doesn't change....
    const subscriber = await Subscriber.findById(_id);
    if (email === subscriber.email) {
      email = undefined;
    }

    if (email && (await Subscriber.emailExist(email))) {
      return res.status(400).json({
        status: 400,
        payload: {
          message: "This email already exist:",
          email,
        },
      });
    }

    await Subscriber.findByIdAndUpdate(_id, {
      email,
      name,
    }).catch((error) => {
      sendErrorMsg(error, res);
    });

    return res.status(200).json({
      status: 200,
      payload: {
        message: "Updated",
        _id,
      },
    });
  },
};

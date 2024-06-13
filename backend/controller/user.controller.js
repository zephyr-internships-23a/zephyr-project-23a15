const User = require("../models/user");
const Application = require("../models/application");
const Property = require("../models/property");
const Chat = require('../models/chat');
const { IncomingForm } = require("formidable");
const path = require("path");
const _ = require("lodash");
const { default: mongoose } = require("mongoose");
const Transaction = require('../models/transaction')
const paymentStore = new Map();
const ObjectId = mongoose.Types.ObjectId;
const stripe = require("stripe")(
  "sk_test_51NHttWSBHFic1op0ZZe94ok6c7fWlrS2Y7hWLCbvecdI3nAxC6MOz1FK4PednXeorKQSJjLpaWIFCTppfGpvGvdU00wRghJyas"
);
async function userInfo(req, res) {
  try {
    // const user = await User.findById(req.user.id).select("-password").populate();   
    let user;
    if (req.user.account_type == 'user') {
      user = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.user.id)
          },
        },
        {
          $lookup: {
            from: 'properties', localField: '_id', foreignField: 'user_id', as: 'properties'
          }
        },
        {
          $lookup: {
            from: 'transactions', localField: '_id', foreignField: 'user_id', as: 'transactions',
            pipeline: [
              {
                $lookup: {
                  from: 'properties', localField: 'property_id', foreignField: '_id', as: 'property'
                }
              },
              {
                $unwind: '$property',
              }
            ]
          }
        }
      ]).exec();
    }
    else {
      user = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.user.id)
          },
        },
        {
          $lookup: {
            from: 'properties', localField: '_id', foreignField: 'user_id', as: 'properties'
          }
        },
        {
          $lookup: {
            from: 'transactions', localField: '_id', foreignField: 'agent_id', as: 'transactions',
            pipeline: [
              {
                $lookup: {
                  from: 'properties', localField: 'property_id', foreignField: '_id', as: 'property'
                }
              },
              {
                $unwind: '$property',
              }
            ]
          }
        }

      ]).exec();
    }
    return res.json({
      success: true,
      user: user?.[0] || {},
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
async function updateUser(req, res) {
  const options = {
    uploadDir: path.join(__dirname, "..", "avatar"),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  };
  const user = req.user;
  const form = new IncomingForm(options);
  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        if (err.code === 1009)
          return res
            .status(400)
            .json({ success: false, message: "Maximum supported file is 5mb" });
        else
          return res
            .status(400)
            .json({ success: false, message: "Somethings went wrong!" });
      }
      const name = fields?.name?.[0];
      const phone = fields?.phone?.[0];
      const address = fields?.address?.[0];
      const file = files?.file?.[0];
      console.log(fields, file);
      if (!name || !phone || !address)
        return res
          .status(400)
          .json({ success: false, message: "Missing name , phone or address" });
      if (_.isEmpty(file)) {
        console.log("dfhdf");
        await User.findByIdAndUpdate(user.id, {
          name: name,
          address: address,
          phone: phone,
        });
        return res.status(200).json({
          success: true,
          message: "Updated profile!",
        });
      }
      console.log(file.newFilename);
      await User.findByIdAndUpdate(user.id, {
        avatar: `http://localhost:4000/${file.newFilename}`,
        name: name,
        address: address,
        phone: phone,
      });
      return res
        .status(200)
        .json({ success: true, message: "Updated profile!" });
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}

async function becomeAgent(req, res) {
  const options = {
    uploadDir: path.join(__dirname, "..", "avatar"),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  };
  const user = req.user;
  const form = new IncomingForm(options);
  const foundapplication = await Application.findOne({ user_id: user.id });
  if (foundapplication) {
    return res
      .status(400)
      .json({ success: false, message: "You already applied" });
  }
  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        if (err.code === 1009)
          return res
            .status(400)
            .json({ success: false, message: "Maximum supported file is 5mb" });
        else
          return res
            .status(400)
            .json({ success: false, message: "Somethings went wrong!" });
      }
      const experience = fields?.experience?.[0];
      const sold = fields?.sold?.[0];
      const file = files?.file?.[0];
      if (!experience || !sold)
        return res.status(400).json({
          success: false,
          message: "Missing experience or properties sold!",
        });
      if (_.isEmpty(file)) {
        return res.status(400).json({
          success: false,
          message: "Missing id proof!",
        });
      }
      const newAgentApplication = new Application({
        id_proof: `http://localhost:4000/${file.newFilename}`,
        experience: experience,
        sold: sold,
        user_id: user.id,
      });
      await newAgentApplication.save();
      return res
        .status(200)
        .json({ success: true, message: "Application sent!" });
    });
  } catch (error) {
    console.log(error, "here");
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}

async function getAgentApplications(req, res) {
  try {
    const agentApplications = await Application.find({ status: "pending" })
      .populate("user_id", "-password")
      .exec();
    return res
      .status(200)
      .json({ success: true, applications: agentApplications });
  } catch (error) {
    console.log(error, "here");
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}

async function grantApplication(req, res) {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res
        .status(400)
        .json({ success: false, message: "Application not found" });
    }
    if (application.status == "rejected") {
      return res
        .status(400)
        .json({ success: false, message: "Application already rejected" });
    }
    application.status = "accepted";
    await User.findByIdAndUpdate(application.user_id, {
      account_type: "agent",
      application: application._id,
    });
    await application.save();
    return res
      .status(200)
      .json({ success: true, message: "Application granted" });
  } catch (error) {
    console.log(error, "here");
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}
async function declineApplication(req, res) {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res
        .status(400)
        .json({ success: false, message: "Application not found" });
    }
    if (application.status == "rejected") {
      return res
        .status(400)
        .json({ success: false, message: "Application already rejected" });
    }
    application.status = "rejected";
    application.save();
    return res
      .status(200)
      .json({ success: true, message: "Application rejected!" });
  } catch (error) {
    console.log(error, "here");
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}

async function getAgents(req, res) {
  try {
    const agents = await User.find({ account_type: "agent" })
      .select("-password")
      .populate("application");
    return res.json({
      success: true,
      agents,
    });
  } catch (error) {
    console.log(error, "here");
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find({ account_type: "user" }).select("-password");
    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error, "here");
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}

async function uploadProperty(req, res) {
  try {
    const options = {
      uploadDir: path.join(__dirname, "..", "avatar"),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024,
    };
    const user = req.user;
    const form = new IncomingForm(options);
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        if (err.code === 1009)
          return res
            .status(400)
            .json({ success: false, message: "Maximum supported file is 5mb" });
        else
          return res
            .status(400)
            .json({ success: false, message: "Somethings went wrong!" });
      }

      const title = fields?.title?.[0];
      const description = fields?.description?.[0];
      const price = fields?.price?.[0];
      const location = fields?.location?.[0];
      const age = fields?.age?.[0];
      const file = files?.files;
      const existProperty = await Property.findOne({ title });
      if (existProperty)
        return res.status(400).json({
          success: false,
          message: "This property already exists!",
        });
      if (!title || !description || !price || !location || !age) {
        return res
          .status(400)
          .json({ success: false, message: "Missing property details" });
      }
      const fileArr = file.map((f) => `http://localhost:4000/${f.newFilename}`);
      console.log(fileArr);
      if (_.isEmpty(file)) {
        return res
          .status(400)
          .json({ success: false, message: "Please upload atleast one image" });
      }

      const newProperty = new Property({
        title,
        description,
        price,
        location,
        age,
        images: fileArr,
        user_id: user.id,
      });
      await newProperty.save();
      return res
        .status(200)
        .json({ success: true, message: "Property created successfully" });
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}

async function getProperties(req, res) {
  try {
    const properties = await Property.find({ booked: false }).populate("user_id", "-password");
    return res.json({
      success: true,
      properties,
    });
  } catch (error) {
    console.log(error, "here");
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}

async function getPropertyById(req, res) {
  try {
    const property = await Property.findById(req.params.id).populate("user_id")
    return res.json({
      success: true,
      message: 'Property fetched successfully',
      property
    })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });

  }
}

async function createPaymentIntent(req, res) {
  try {
    const { } = req.body;
  } catch (error) {

  }
}

async function deleteProperty(req, res) {
  try {
    await Property.findByIdAndDelete(req.params.id)
    return res.json({
      success: true,
      message: 'Deleted successfully!'
    })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}


async function searchProperty(req, res) {
  try {
    const properties = await Property.find({
      $and: [
        {
          booked: false
        },
        {
          $or: [

            {
              title: {
                $regex: '.*' + req.query.search + '.*',
                $options: 'i'
              }
            },
            {
              description: {
                $regex: '.*' + req.query.search + '.*',
                $options: 'i'
              }
            },
            {
              location: {
                $regex: '.*' + req.query.search + '.*',
                $options: 'i'
              }
            }

          ]
        }
      ]
    }).populate('user_id', '-password',)
    return res.json({
      success: true,
      properties
    })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });

  }
}

async function createChatRoom(req, res) {
  const { user_one, user_two } = req.body;
  try {
    const chatExist = await Chat.findOne({
      $or: [
        {
          user_one: user_one,
          user_two: user_two
        },
        {
          user_one: user_two,
          user_two: user_one
        }
      ]
    });
    if (chatExist) {
      return res.json({
        success: true,
        chatId: chatExist._id
      })
    }
    const newChat = new Chat({
      user_one,
      user_two
    });
    await newChat.save();
    return res.json({
      success: true,
      chatId: newChat._id
    })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}

/**
 * Retrieves the chats for the given request and sends the response.
 * @param {Request} req - The request object containing the necessary data.
 * @param {Response} res - The response object used to send the result.
 * @return {Promise<void>} A Promise that resolves when the response is sent.
 */
async function getChats(req, res) {
  const { id } = req.user;
  try {
    const chats = await Chat.find({
      $or: [
        {
          user_one: id
        },
        {
          user_two: id
        }
      ]
    }).populate('user_one', '-password')
      .populate('user_two', '-password')
    return res.json({
      success: true,
      chats
    })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });

  }
}

async function createPaymentIntent(req, res) {
  try {
    const { price, user_id, agent_id, property_id } = req.body
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "INR",
    });
    const newPayment = {
      price, user_id, agent_id, property_id,
      payment_id: paymentIntent.id,
    };
    paymentStore.set(user_id, newPayment);
    return res.json({
      ClientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}

async function confirmPayment(req, res) {
  try {
    const { id } = req.user;
    const paymentIntent = paymentStore.get(id);
    const alreadyAppied = await Transaction.findOne({
      $and: [{
        user_id: paymentIntent.user_id,
      },
      {
        property_id: paymentIntent.property_id,
      },
      ],
    });
    if (alreadyAppied) {
      return res.status(400).json({
        success: false,
        message: "Alread confirmed",
      });
    }
    const newTransaction = new Transaction({
      user_id: paymentIntent.user_id,
      agent_id: paymentIntent.agent_id,
      property_id: paymentIntent.property_id,
      price: paymentIntent.price,
      payment_id: paymentIntent.payment_id,
    });
    await newTransaction.save();
    await Property.findByIdAndUpdate(paymentIntent.property_id, {
      booked: true
    })
    paymentStore.delete(id);
    return res.status(200).json({
      success: true,
      message: "Payment confirmed",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });

  }
}

async function adminSearchUser(req, res) {
  try {
    const { search } = req.query;
    let query;
    if (ObjectId.isValid(search)) {
      query = [

        {
          _id: search
        },

        {
          name: {
            $regex: '.*' + search + '.*',
            $options: 'i'
          }
        }
      ]
    }
    else {
      query = [
        {
          name: {
            $regex: '.*' + search + '.*',
            $options: 'i'
          }
        }
      ]
    }
    const users = await User.find({
      $and: [
        {
          $or: query
        },
        {
          account_type: 'user'
        }
      ]
    })
    return res.json({
      success: true,
      users
    })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}
async function adminSearchAgent(req, res) {
  try {
    const { search } = req.query;
    let query;
    if (ObjectId.isValid(search)) {
      query = [

        {
          _id: search
        },

        {
          name: {
            $regex: '.*' + search + '.*',
            $options: 'i'
          }
        }
      ]
    }
    else {
      query = [
        {
          name: {
            $regex: '.*' + search + '.*',
            $options: 'i'
          }
        }
      ]
    }
    const users = await User.find({
      $and: [
        {
          $or: query
        },
        {
          account_type: 'agent'
        }
      ]
    })
    return res.json({
      success: true,
      users
    })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}
async function adminSearchTransaction(req, res) {
  try {
    const { search } = req.query;
    if (!ObjectId.isValid(search)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction id"
      })
    }
    const transactions = await Transaction.find({
      _id: search
    })
    return res.json({
      success: true,
      transactions
    })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}
async function adminTransactions(req, res) {
  try {
    const transactions = await Transaction.find().populate('property_id')
    return res.json({
      success: true,
      transactions
    })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}

async function deleteAgent(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user && user.account_type == 'agent') await User.findByIdAndDelete(id);
    else {
      return res.status(400).json({
        success: false,
        message: "Agent not found"
      })
    }
    return res.json({
      success: true,
      message: "Agent deleted successfully"
    })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });

  }
}
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user && user.account_type == 'user') await User.findByIdAndDelete(id);
    else {
      return res.status(400).json({
        success: false,
        message: "Agent not found"
      })
    }
    return res.json({
      success: true,
      message: "User deleted successfully"
    })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });

  }
}

async function updateProperty(req, res) {
  try {
    const options = {
      uploadDir: path.join(__dirname, "..", "avatar"),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024,
    };
    const user = req.user;
    const form = new IncomingForm(options);
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        if (err.code === 1009)
          return res
            .status(400)
            .json({ success: false, message: "Maximum supported file is 5mb" });
        else
          return res
            .status(400)
            .json({ success: false, message: "Somethings went wrong!" });
      }
      console.log(fields)
      const title = fields?.title?.[0];
      const description = fields?.description?.[0];
      const price = fields?.price?.[0];
      const location = fields?.location?.[0];
      const age = fields?.age?.[0];
      const existingImages = fields?.existingImages;
      const file = files?.files;
      if (!title || !description || !price || !location || !age) {
        return res
          .status(400)
          .json({ success: false, message: "Missing property details" });
      }
      if (_.isEmpty(file) && existingImages?.length == 0) {
        return res
          .status(400)
          .json({ success: false, message: "Please include atleast one image" });
      }
      let fileArr = existingImages
      fileArr = fileArr.concat(file?.map((f) => `http://localhost:4000/${f.newFilename}`))
      await Property.findByIdAndUpdate(req.params.id, {
        title,
        description,
        price,
        location,
        age,
        images: fileArr,
      })
      return res
        .status(200)
        .json({ success: true, message: "Property updated successfully" });
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Somethings went wrong!" });
  }
}


module.exports = {
  userInfo,
  updateUser,
  becomeAgent,
  getAgentApplications,
  declineApplication,
  grantApplication,
  getAgents,
  getUsers,
  uploadProperty,
  getProperties,
  getPropertyById,
  deleteProperty,
  searchProperty,
  createChatRoom,
  getChats,
  createPaymentIntent,
  confirmPayment,
  adminSearchUser,
  adminSearchAgent,
  adminSearchTransaction,
  adminTransactions,
  deleteAgent,
  deleteUser,
  updateProperty
};

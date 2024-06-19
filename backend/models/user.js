const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not valid email`,
    },
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    minLength: [3, "Too short password"],
    required: true,
    trim: true,
  },
  account_type: {
    type: String,
    default: "user", //agent || admin
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  avatar: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  },
  avatar_id: {
    type: String
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'application'
  }
}, {
  timestamps: true
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});
//vadlidate the password
userSchema.methods.isValidatedPassword = async function (usersendPassword) {
  try {
    return await bcrypt.compare(usersendPassword, this.password);
  } catch (err) {
    console.log(error);
    return false;
  }
};
module.exports = mongoose.model("user", userSchema);

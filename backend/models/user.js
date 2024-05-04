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
    default: "user",
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
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

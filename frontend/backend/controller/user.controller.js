const User = require("../models/user");
const { IncomingForm } = require('formidable')
const path = require('path')
const _ = require('lodash')
async function userInfo(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.json({
      success: true,
      user: user,
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
    uploadDir: path.join(__dirname, '..', "avatar"),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
  };
  const user = req.user;
  const form = new IncomingForm(options);
  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err)
        if (err.code === 1009)
          return res.status(400).json({ success: false, message: "Maximum supported file is 5mb" });
        else return res.status(400).json({ success: false, message: "Somethings went wrong!" });
      }
      const name = fields?.name?.[0];
      const phone = fields?.phone?.[0];
      const address = fields?.address?.[0];
      const file = files?.file?.[0];  
      console.log(fields,file)
      if (!name || !phone || !address)
        return res.status(400).json({ success: false, message: "Missing name , phone or address" });
      if (_.isEmpty(file)) { 
        console.log('dfhdf')
        await User.findByIdAndUpdate(user.id, {
          name: name,
          address: address,
          phone: phone
        })
        return res.status(200).json({
          success: true,
          message: "Updated profile!"
        })
      } 
      console.log(file.newFilename)
      await User.findByIdAndUpdate(user.id, {
        avatar: `http://localhost:4000/${file.newFilename}`,
        name: name,
        address: address,
        phone: phone

      });
      return res.status(200).json({ success: true, message: "Updated profile!" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Somethings went wrong!" });
  }
}
module.exports = {
  userInfo,
  updateUser
};

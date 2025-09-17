// backend/models/User.js
//User model with pre-save password hashing and password comparison method
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//User schema definition
//Name, email(unique), password(hashed), role(user/admin), timestamps(automatic createdAt, updatedAt)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user","admin"], default: "user" }
}, { timestamps: true });

//Pre-save middleware to hash password if modified or new
//Only hashes if password field is changed
// Uses bcrypt with salt rounds of 10
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash; //Set hashed password
      next();
    });
  });
});

//Method to compare entered password with hashed password
userSchema.methods.matchPassword = function (enteredPassword, callback) {
  bcrypt.compare(enteredPassword, this.password, callback);
};
//Export User model
module.exports = mongoose.model("User", userSchema);

import mongoose from "npm:mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

}, {
  timestamps: true
});


const User = mongoose.model('User', userSchema);

export default User; 
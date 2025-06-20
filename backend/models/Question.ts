import mongoose, { Schema, model } from "npm:mongoose";

const questionSchema = new Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  isAnswered: {
    type: Boolean,
    default: false
  },

}, {
  timestamps: true
});

const Question = model('Question', questionSchema);

export default Question; 
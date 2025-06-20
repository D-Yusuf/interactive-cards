import mongoose, { Schema, model } from "npm:mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    enum: ['red', 'blue', 'green', 'orange', 'yellow', 'purple', 'pink', 'gray']
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }]
}, {
  timestamps: true
});

const Category = model('Category', categorySchema);

export default Category;
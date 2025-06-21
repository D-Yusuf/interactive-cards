import { model, Schema } from "mongoose";



const gameSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  firstTeamName: {
    type: String,
    required: true
  },
  secondTeamName: {
    type: String,
    required: true
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  }],
  firstTeamScore: {
    type: Number,
    default: 0
  },
  secondTeamScore: {
    type: Number,
    default: 0
  },
  currentQuestion: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed'],
    default: 'ongoing'
  },
  winner: {
    type: String,
    default: null
  },
  answeredQuestions: [{
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    teamName: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    answeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  selectedQuestions: [{
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    pointValue: {
      type: Number,
      required: true
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    }
  }]
  
}, { timestamps: true });


const Game = model('Game', gameSchema);

export default Game;

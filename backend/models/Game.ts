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
  
}, { timestamps: true });


const Game = model('Game', gameSchema);

export default Game;

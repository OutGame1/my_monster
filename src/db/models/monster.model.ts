import { Schema, models, model } from 'mongoose'

const monsterSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: false,
    default: 1
  },
  traits: {
    type: String, // JSON stringified MonsterDesign
    required: true
  },
  state: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'angry', 'hungry', 'sleepy'],
    default: 'happy'
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, {
  versionKey: false,
  timestamps: true
})

export default models.Monster ?? model('Monster', monsterSchema)

import mongoose, { Document, Schema } from 'mongoose';

export interface IShortlist extends Document {
  recruiterId: mongoose.Types.ObjectId;  // Who saved it
  developerId: mongoose.Types.ObjectId;  // Which developer
  notes: string;                         // Optional notes
  createdAt: Date;
}

const ShortlistSchema = new Schema<IShortlist>({
  recruiterId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  developerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate entries
ShortlistSchema.index({ recruiterId: 1, developerId: 1 }, { unique: true });

export default mongoose.model<IShortlist>('Shortlist', ShortlistSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  favoriteCharacters: string[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  favoriteCharacters: [{ type: String }],
});

export default mongoose.model<IUser>('User', UserSchema);

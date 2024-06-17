import mongoose, { Schema, Document, Model } from 'mongoose';

interface IOrigin {
  name: string;
  dimension: string;
}

interface IEpisode {
  id: string;
  name: string;
  air_date: string;
}

export interface ICharacter extends Document {
  id: string;
  name: string;
  image: string;
  species: string;
  gender: string;
  origin: IOrigin;
  status: string;
  episode: IEpisode[];
  lastUpdated: Date;
  page: number;
}

const OriginSchema: Schema = new Schema({
  name: { type: String, required: false },
  dimension: { type: String },
});

const EpisodeSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  air_date: { type: String, required: false },
});

const CharacterSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: false },
  species: { type: String, required: false },
  gender: { type: String, required: false },
  origin: { type: OriginSchema, required: false },
  status: { type: String, required: false },
  episode: { type: [EpisodeSchema], required: false },
  lastUpdated: { type: Date, default: Date.now },
  page: { type: Number, required: false },
});

const Character: Model<ICharacter> = mongoose.model<ICharacter>(
  'Character',
  CharacterSchema
);

export default Character;

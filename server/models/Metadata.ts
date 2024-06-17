import mongoose, { Schema, Document } from 'mongoose';

export interface IMetadata extends Document {
  key: string;
  value: any;
}

const MetadataSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  value: Schema.Types.Mixed,
});

export default mongoose.model<IMetadata>('Metadata', MetadataSchema);

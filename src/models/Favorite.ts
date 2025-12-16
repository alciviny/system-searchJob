import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

// Interface para tipagem forte do documento de Favorito
export interface IFavorite extends Document {
  user: IUser['_id'];
  titulo: string;
  empresa: string;
  localizacao: string;
  url: string;
  descricao: string;
  contrato: string;
  data: string;
  fonte: string;
}

const FavoriteSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  titulo: {
    type: String,
    required: true,
  },
  empresa: {
    type: String,
  },
  localizacao: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
  },
  contrato: {
    type: String,
  },
  data: {
    type: String,
  },
  fonte: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IFavorite>('Favorite', FavoriteSchema);

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface para tipagem forte do documento do Usuário
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Não retorna a senha em consultas por padrão
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hook (gancho) do Mongoose que é executado ANTES de salvar
// Usamos uma function() normal para ter acesso ao `this` do documento
UserSchema.pre<IUser>('save', async function (next) {
  // Se a senha não foi modificada, apenas continua
  if (!this.isModified('password')) {
    return next();
  }

  // Gera o hash com um "custo" de 12 e atribui de volta à senha do usuário
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});

export default mongoose.model<IUser>('User', UserSchema);

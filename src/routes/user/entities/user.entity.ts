import { User } from '@prisma/client';

export class UserEntity implements User {
  id: number;

  cpf: string;
  name: string;
  sector: string;
  phone: string;

  isAdmin: boolean;
  password: string;

  createdAt: Date;
}

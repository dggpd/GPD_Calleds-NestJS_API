export interface UserViewAdm {
  id: number;

  cpf: string;
  name: string;
  sector: string;
  phone: string;

  isAdmin: boolean;
  createdAt: Date;
}

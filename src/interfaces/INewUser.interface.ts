export interface INewUser {
  usuario: {
    cpf: string;
    nome: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    username: string;
    password: string;
  };
  tipos: string[];
}

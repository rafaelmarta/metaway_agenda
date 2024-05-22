export interface INewPerson {
  endereco: {
    bairro: string;
    cep: string;
    cidade: string;
    estado: string;
    logradouro: string;
    numero: number;
    pais: string;
  };
  cpf: string;
  nome: string;
}

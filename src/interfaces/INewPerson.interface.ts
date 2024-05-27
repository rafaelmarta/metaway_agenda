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
  foto?: {
    id: string;
    name: string;
    type: string;
  };
  cpf: string;
  nome: string;
  id?: number;
}

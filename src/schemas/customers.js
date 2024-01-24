import { getOnlyNumbers } from "../utils/function.js";

const createCustomerSchema = {
  name: {
    custom: {
      options: (value) => {
        const parts = value?.split(" ");
        return parts?.length >= 2;
      },
    },
    errorMessage: "O nome completo é obrigatório",
  },
  email: { isEmail: true, errorMessage: "Email inválido" },
  phone: {
    custom: {
      options: (value) => {
        const sanitizedNumber = getOnlyNumbers(value);
        return sanitizedNumber.length === 11;
      },
    },
    errorMessage: "Número de telefone válido é obrigatório.",
  },
  coordinateX: {
    custom: {
      options: (value) => {
        const numericValue = Number(value);
        return !isNaN(numericValue);
      },
    },
    errorMessage: "Coordenada X inválida.",
  },
  coordinateY: {
    custom: {
      options: (value) => {
        const numericValue = Number(value);
        return !isNaN(numericValue);
      },
    },
    errorMessage: "Coordenada Y inválida.",
  },
};

export { createCustomerSchema };

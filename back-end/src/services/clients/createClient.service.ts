import { hash } from "bcryptjs";
import { AppDataSource } from "../../data-source";
import { Client } from "../../entities/client.entity";
import { AppError } from "../../errors/appError";
import { IClientRequest } from "../../interfaces/clients/clients";
import { handleUniqueViolation } from "../../utils/handleUniqueViolation";

const createClientService = async (
  clientData: IClientRequest,
): Promise<Client> => {
  const clientRepository = AppDataSource.getRepository(Client);

  // Verifica a existência do e-mail sem carregar todos os clientes.
  const emailAlreadyExists = await clientRepository.existsBy({
    email: clientData.email,
  });

  if (emailAlreadyExists) {
    throw new AppError("Email already exists", 409);
  }

  // Gera o hash da senha.
  const hashedPassword = await hash(clientData.password, 10);

  // Prepara a entidade.
  const client = clientRepository.create({
    name: clientData.name,
    email: clientData.email,
    telephone: clientData.telephone,
    password: hashedPassword,
  });

  // Salva e retorna a entidade.
  try {
    return await clientRepository.save(client);
  } catch (error) {
    return handleUniqueViolation(error);
  }
};

export default createClientService;

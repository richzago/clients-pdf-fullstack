import { AppDataSource } from "../../data-source";
import { Client } from "../../entities/client.entity";
import { Contact } from "../../entities/contact.entity";
import { AppError } from "../../errors/appError";
import { IContactRequest } from "../../interfaces/contacts/contacts";
import { handleUniqueViolation } from "../../utils/handleUniqueViolation";

const createContactService = async (
  contactData: IContactRequest,
  clientId: string,
): Promise<Contact> => {
  const contactRepository = AppDataSource.getRepository(Contact);
  const clientRepository = AppDataSource.getRepository(Client);

  // Confirma a existência do cliente autenticado.
  const clientExists = await clientRepository.existsBy({
    id: clientId,
  });

  if (!clientExists) {
    throw new AppError("Client not found", 404);
  }

  // Verifica o e-mail diretamente no banco.
  const emailAlreadyExists = await contactRepository.existsBy({
    email: contactData.email,
  });

  if (emailAlreadyExists) {
    throw new AppError("Email already exists", 409);
  }

  // Referência ao cliente existente, sem carregá-lo inteiro.
  const client = clientRepository.create({
    id: clientId,
  });

  const contact = contactRepository.create({
    name: contactData.name,
    email: contactData.email,
    telephone: contactData.telephone,
    client,
  });

  try {
    return await contactRepository.save(contact);
  } catch (error) {
    return handleUniqueViolation(error);
  }
};

export default createContactService;

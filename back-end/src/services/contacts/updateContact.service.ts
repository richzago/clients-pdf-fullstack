import { AppDataSource } from "../../data-source";
import { Contact } from "../../entities/contact.entity";
import { AppError } from "../../errors/appError";

const updateContactService = async (
  dataContact: Partial<Contact>,
  contactId: string,
  clientId: string,
): Promise<Contact> => {
  const contactRepository = AppDataSource.getRepository(Contact);

  // Busca o contato somente se pertencer ao cliente autenticado.
  const contact = await contactRepository.findOne({
    where: {
      id: contactId,
    },
    relations: {
      client: true,
    },
  });

  if (!contact) {
    throw new AppError("Contact not found", 404);
  }

  if (contact.client.id !== clientId) {
    throw new AppError("You are not allowed to update this contact", 403);
  }

  // Não permite alterar propriedades internas da entidade.
  const allowedFields = ["name", "email", "telephone"];

  const invalidFields = Object.keys(dataContact).filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    throw new AppError("Invalid fields for contact update", 400);
  }

  // Atualiza apenas os campos permitidos.
  if (dataContact.name !== undefined) {
    contact.name = dataContact.name;
  }

  if (dataContact.email !== undefined) {
    contact.email = dataContact.email;
  }

  if (dataContact.telephone !== undefined) {
    contact.telephone = dataContact.telephone;
  }

  return await contactRepository.save(contact);
};

export default updateContactService;

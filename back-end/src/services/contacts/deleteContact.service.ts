import { AppDataSource } from "../../data-source";
import { Contact } from "../../entities/contact.entity";
import { AppError } from "../../errors/appError";
import { requireEntity } from "../../utils/requireEntity";

const deleteContactService = async (
  contactId: string,
  clientId: string,
): Promise<void> => {
  const contactRepository = AppDataSource.getRepository(Contact);

  const contact = requireEntity(
    await contactRepository.findOne({
      where: { id: contactId },
      relations: { client: true },
    }),
    "Contact not found",
  );

  if (contact.client.id !== clientId) {
    throw new AppError("You are not allowed to delete this contact", 403);
  }

  await contactRepository.remove(contact);
};

export default deleteContactService;

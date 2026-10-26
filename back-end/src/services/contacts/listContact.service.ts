import { AppDataSource } from "../../data-source";
import { Contact } from "../../entities/contact.entity";

const listContactService = async (clientId: string): Promise<Contact[]> => {
  const contactRepository = AppDataSource.getRepository(Contact);

  const contacts = await contactRepository.find({
    where: {
      client: {
        id: clientId,
      },
    },
  });

  return contacts;
};

export default listContactService;

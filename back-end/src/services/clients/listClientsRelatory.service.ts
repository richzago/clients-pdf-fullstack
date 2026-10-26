import { AppDataSource } from "../../data-source";
import { Client } from "../../entities/client.entity";

const listClientsRelatoryService = async (
  clientId: string,
): Promise<Client[]> => {
  const clientRepository = AppDataSource.getRepository(Client);

  const clients = await clientRepository.find({
    where: { id: clientId },
    relations: { contact: true },
  });

  return clients;
};
export default listClientsRelatoryService;

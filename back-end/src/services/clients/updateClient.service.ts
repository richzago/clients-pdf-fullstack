import { AppDataSource } from "../../data-source";
import { Client } from "../../entities/client.entity";
import { IClientUpdate } from "../../interfaces/clients/clients";
import { requireEntity } from "../../utils/requireEntity";
import preparePasswordUpdate from "./preparePasswordUpdate.service";

const updateClientService = async (
  dataClient: IClientUpdate,
  clientId: string,
): Promise<void> => {
  const clientRepository = AppDataSource.getRepository(Client);

  const client = requireEntity(
    await clientRepository.findOneBy({ id: clientId }),
    "Client not found",
  );

  const { password, currentPassword, ...clientFields } = dataClient;

  const updates: Partial<Client> = { ...clientFields };

  if (password !== undefined) {
    updates.password = await preparePasswordUpdate(
      currentPassword,
      password,
      client.password,
    );
  }

  await clientRepository.update(clientId, updates);
};

export default updateClientService;

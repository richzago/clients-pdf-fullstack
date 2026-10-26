import { Request, Response } from "express";
import { Client } from "../../entities/client.entity";
import { instanceToPlain } from "class-transformer";
import createClientService from "../../services/clients/createClient.service";
import deleteClientService from "../../services/clients/deleteClient.service";
import updateClientService from "../../services/clients/updateClient.service";
import generateHTML from "../../utils/generateHTML";
import convertToPDF from "../../utils/convertToPDF";
import listClientsService from "../../services/clients/listClient.service";
import listClientsRelatoryService from "../../services/clients/listClientsRelatory.service";

const createClientController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const clientData = req.body;
  const client: Client = await createClientService(clientData);
  return res.status(201).send(instanceToPlain(client));
};

const listClientController = async (req: Request, res: Response) => {
  const id = req.client.id;
  const clients = await listClientsService(id);
  return res.send(instanceToPlain(clients));
};

const deleteClientController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id = req.client.id;
  const deletedClient: void = await deleteClientService(id);
  return res.status(204).send();
};

const updateClientController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id: string = req.params.id;
  const dataUser = req.body;
  const updatedClient = await updateClientService(dataUser, id);

  return res.status(200).json({ message: "Update successful" });
};

const listClientsRelatoryController = async (req: Request, res: Response) => {
  const clients = await listClientsRelatoryService();
  return res.send(instanceToPlain(clients));
};

const relatoryClientsController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const clients = await listClientsRelatoryService();

  const clientsWithContacts = clients.map((client) => ({
    client,
    contacts: client.contact,
  }));

  const html = generateHTML(clientsWithContacts);

  const pdf = await convertToPDF(html);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="relatorio-clientes.pdf"',
  );

  return res.status(200).send(pdf);
};

export {
  createClientController,
  listClientController,
  deleteClientController,
  updateClientController,
  listClientsRelatoryController,
  relatoryClientsController,
};

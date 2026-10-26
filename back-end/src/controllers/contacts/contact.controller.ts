import { instanceToPlain } from "class-transformer";
import { Request, Response } from "express";
import { Contact } from "../../entities/contact.entity";
import createContactService from "../../services/contacts/createContact.service";
import deleteContactService from "../../services/contacts/deleteContact.service";
import listContactService from "../../services/contacts/listContact.service";
import updateContactService from "../../services/contacts/updateContact.service";

const createContactController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const contactData = await req.body;
  const clientID = req.client.id;
  const client: Contact = await createContactService(contactData, clientID);
  return res.status(201).send(instanceToPlain(client));
};

const listContactController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const clientId = req.client.id;
  const contacts = await listContactService(clientId);
  return res.status(200).json(instanceToPlain(contacts));
};

const deleteContactController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id: string = req.params.id;
  const deletedContact: void = await deleteContactService(id);
  return res.status(204).json(deletedContact);
};
const updateContactController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id: string = req.params.id;
  const dataContact = req.body;
  const updatedContact = await updateContactService(dataContact, id);

  return res.status(200).json({ message: "Update successful" });
};

export {
  createContactController,
  listContactController,
  deleteContactController,
  updateContactController,
};

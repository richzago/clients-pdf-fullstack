import { Router } from "express";
import {
  createContactController,
  deleteContactController,
  listContactController,
  updateContactController,
} from "../controllers/contacts/contact.controller";
import { authClient } from "../middlewares/authClient.middleware";
import validateSchema from "../middlewares/validateSchema.middleware";
import { createContactValidator } from "../schemas/createContact.schema";
import { validateUUID } from "../middlewares/validateUUID.middleware";

const contactsRouter = Router();

contactsRouter.post(
  "",
  authClient,
  validateSchema(createContactValidator),
  createContactController
);
contactsRouter.get("", authClient, listContactController);
contactsRouter.delete("/:id", authClient, validateUUID, deleteContactController);
contactsRouter.patch("/:id", authClient, validateUUID, updateContactController);

export default contactsRouter;

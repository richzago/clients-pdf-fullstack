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
import { updateContactValidator } from "../schemas/updateContact.schema";

const contactsRouter = Router();

contactsRouter.post(
  "",
  authClient,
  validateSchema(createContactValidator),
  createContactController,
);
contactsRouter.get("", authClient, listContactController);
contactsRouter.delete(
  "/:id",
  authClient,
  validateUUID,
  deleteContactController,
);
contactsRouter.patch(
  "/:id",
  authClient,
  validateUUID,
  validateSchema(updateContactValidator),
  updateContactController,
);

export default contactsRouter;

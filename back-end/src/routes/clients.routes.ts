import { Router } from "express";
import {
  createClientController,
  deleteClientController,
  listClientController,
  relatoryClientsController,
  updateClientController,
} from "../controllers/clients/client.controller";
import { authClient } from "../middlewares/authClient.middleware";
import validateSchema from "../middlewares/validateSchema.middleware";
import { createClientValidator } from "../schemas/createClient.schema";
import clientSessionRouter from "./session.routes";
import { validateUUID } from "../middlewares/validateUUID.middleware";
import { updateClientValidator } from "../schemas/updateClient.schema";

const clientsRouter = Router();

clientsRouter.post(
  "",
  validateSchema(createClientValidator),
  createClientController,
);
clientsRouter.get("", authClient, listClientController);
clientsRouter.get("/relatory", authClient, relatoryClientsController);
clientsRouter.delete("/:id", authClient, validateUUID, deleteClientController);
clientsRouter.patch(
  "/:id",
  authClient,
  validateUUID,
  validateSchema(updateClientValidator),
  updateClientController,
);

export default clientsRouter;

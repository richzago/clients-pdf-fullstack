import { Router } from "express";
import clientLoginController from "../controllers/session/clientSession.controller";
import { clientLoginValidator } from "../schemas/clientLogin.schema";
import validateSchema from "../middlewares/validateSchema.middleware";

const clientSessionRouter = Router();

clientSessionRouter.post(
  "",
  validateSchema(clientLoginValidator),
  clientLoginController,
);

export default clientSessionRouter;

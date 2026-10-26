import { Client } from "../../entities/client.entity";
import { Contact } from "../../entities/contact.entity";

export interface IClientRequest {
  name: string;
  email: string;
  password: string;
  telephone: string;
}

export interface IClient {
  name: string;
  email: string;
  password: string;
  telephone: string;
  createdAt: string;
  updatedAt: string;
}

export interface IClientUpdate {
  name?: string;
  email?: string;
  telephone?: string;
  password?: string;
  currentPassword?: string;
}



export interface IClientWithContacts {
  client: Client;
  contacts: Contact[];
}

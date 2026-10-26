import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../services/api";

import type {
  IClientsList,
  IContact,
  IContactRegister,
} from "../interfaces/client";

export interface IDataRegister {
  name: string;
  email: string;
  password: string;
  telephone: string;
  id?: string;
}

export interface IDataClientLogin {
  email: string;
  password: string;
}

export interface IClientID {
  id: string;
}

interface IClientProps {
  children: ReactNode;
}

interface clientContextData {
  clientRegister: (data: IDataRegister) => void;
  clientLogin: (data: IDataClientLogin) => void;

  listClients: () => Promise<void>;
  listContacts: () => Promise<void>;

  deleteClient: (id: string) => Promise<boolean>;
  deleteContact: (id: string) => Promise<boolean>;

  clients: IClientsList[];
  contacts: IContact[];

  client: IDataRegister;
  setClient: React.Dispatch<React.SetStateAction<IDataRegister>>;

  contactRegister: (data: IContactRegister) => void;

  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<clientContextData>(
  {} as clientContextData,
);

const emptyClient: IDataRegister = {
  name: "",
  email: "",
  password: "",
  telephone: "",
};

const AuthProvider = ({ children }: IClientProps) => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [client, setClient] = useState<IDataRegister>(() => {
    const storedClient = localStorage.getItem("clientObject");

    if (!storedClient) return emptyClient;

    try {
      return JSON.parse(storedClient) as IDataRegister;
    } catch {
      return emptyClient;
    }
  });

  const [clients, setClients] = useState<IClientsList[]>([]);
  const [contacts, setContacts] = useState<IContact[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("@TOKEN");

    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const clientRegister = async (data: IDataRegister) => {
    try {
      const response = await api.post("/clients", data);

      localStorage.setItem("@CLIENT_ID", response.data.id);

      if (response.status === 201) {
        navigate("/login");
        toast.success("Account successfully created!");
      } else {
        toast.error("Account already registered!");
      }
    } catch {
      toast.error("There was an error creating the account");
    }
  };

  const clientLogin = (data: IDataClientLogin) => {
    api
      .post("/login", data)
      .then((response) => {
        localStorage.setItem("@TOKEN", response.data.token);
        localStorage.setItem("isAuthenticated", "true");

        setIsAuthenticated(true);

        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        toast.error("Incorrect login or password");
      });
  };

  const listClients = async () => {
    try {
      const token = localStorage.getItem("@TOKEN");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClients(response.data);
    } catch (error) {
      localStorage.removeItem("@TOKEN");
      console.error(error);
    }
  };

  const listContacts = async () => {
    try {
      const token = localStorage.getItem("@TOKEN");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/contacts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContacts(response.data);
    } catch (error) {
      localStorage.removeItem("@TOKEN");
      console.error(error);
    }
  };

  const deleteClient = async (id: string): Promise<boolean> => {
    const token = localStorage.getItem("@TOKEN");

    if (!token) {
      toast.error("Session expired. Please log in again.");
      return false;
    }

    try {
      const response = await api.delete(`/clients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 204) {
        toast.error("Unable to delete client.");
        return false;
      }

      setClients((previous) => previous.filter((item) => item.id !== id));

      // Excluir a conta encerra a sessão.
      localStorage.removeItem("@TOKEN");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("@CLIENT_ID");
      localStorage.removeItem("clientObject");

      setIsAuthenticated(false);
      setClient(emptyClient);

      toast.success("Account deleted successfully!");
      navigate("/login", { replace: true });

      return true;
    } catch (error) {
      console.error("Client deletion error:", error);
      toast.error("Failed to delete client.");
      return false;
    }
  };

  const contactRegister = async (data: IContactRegister) => {
    const token = localStorage.getItem("@TOKEN");

    if (!token) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    try {
      const response = await api.post("/contacts", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        localStorage.setItem("@CONTACT_ID", response.data.id);

        // Busca novamente os contatos após cadastrar.
        await listContacts();

        toast.success("Contact successfully created!");
      } else {
        toast.error("Contact already registered!");
      }
    } catch (error) {
      console.error("Contact registration error:", error);
      toast.error("There was an error creating the contact");
    }
  };

  const deleteContact = async (id: string): Promise<boolean> => {
    const token = localStorage.getItem("@TOKEN");

    if (!token) {
      toast.error("Session expired. Please log in again.");
      return false;
    }

    try {
      const response = await api.delete(`/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 204) {
        toast.error("Unable to delete contact.");
        return false;
      }

      setContacts((previous) => previous.filter((item) => item.id !== id));

      toast.success("Contact deleted successfully!");
      return true;
    } catch (error) {
      console.error("Contact deletion error:", error);
      toast.error("Failed to delete contact.");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        clientRegister,
        clientLogin,
        listClients,
        listContacts,
        deleteClient,
        deleteContact,
        contactRegister,

        clients,
        contacts,
        client,
        setClient,

        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

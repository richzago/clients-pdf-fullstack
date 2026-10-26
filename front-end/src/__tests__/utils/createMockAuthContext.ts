import { vi } from "vitest";
import type { ContextType } from "react";

import { AuthContext } from "../../contexts/AuthContext";

type AuthContextValue = ContextType<typeof AuthContext>;

export const createMockAuthContext = (
  overrides: Partial<AuthContextValue> = {},
): AuthContextValue => {
  return {
    clientRegister: vi.fn(),
    clientLogin: vi.fn(),
    contactRegister: vi.fn(),

    listClients: vi.fn(async () => {}),
    listContacts: vi.fn(async () => {}),

    deleteClient: vi.fn(),
    deleteContact: vi.fn(),

    clients: [],
    contacts: [],

    client: {
      name: "",
      email: "",
      password: "",
      telephone: "",
    },

    setClient: vi.fn(),

    isAuthenticated: false,
    setIsAuthenticated: vi.fn(),

    ...overrides,
  };
};

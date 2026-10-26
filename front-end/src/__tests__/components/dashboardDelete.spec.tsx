import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";
import { DashboardClient } from "../../components/dashboard/client";
import { DashboardContact } from "../../components/dashboard/contact";

import { createMockAuthContext } from "../utils/createMockAuthContext";

import type { IClientsList, IContact } from "../../interfaces/client";

const mockedClient: IClientsList = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "Cliente de Teste",
  email: "cliente@email.com",
  telephone: "51999999999",
  createdAt: "2026-10-01T10:00:00.000Z",
  updatedAt: "2026-10-01T10:00:00.000Z",
  contact: [],
};

const mockedContact: IContact = {
  id: "550e8400-e29b-41d4-a716-446655440002",
  name: "Contato de Teste",
  email: "contato@email.com",
  telephone: "51988888888",
  createdAt: "2026-10-01T10:00:00.000Z",
  updatedAt: "2026-10-01T10:00:00.000Z",
};

describe("Exclusao pelo dashboard", () => {
  it("deve passar o UUID correto ao excluir um cliente", async () => {
    const deleteClientMock = vi.fn();

    const context = createMockAuthContext({
      isAuthenticated: true,
      clients: [mockedClient],
      deleteClient: deleteClientMock,
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={context}>
          <DashboardClient />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Client" }));

    expect(
      await screen.findByText("Name: Cliente de Teste"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete Client" }));

    expect(deleteClientMock).toHaveBeenCalledTimes(1);
    expect(deleteClientMock).toHaveBeenCalledWith(mockedClient.id);
  });

  it("deve passar o UUID correto ao excluir um contato", async () => {
    const deleteContactMock = vi.fn();

    const context = createMockAuthContext({
      isAuthenticated: true,
      contacts: [mockedContact],
      deleteContact: deleteContactMock,
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={context}>
          <DashboardContact />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Search Contacts!",
      }),
    );

    expect(
      await screen.findByText("Name: Contato de Teste"),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete Contact",
      }),
    );

    expect(deleteContactMock).toHaveBeenCalledTimes(1);
    expect(deleteContactMock).toHaveBeenCalledWith(mockedContact.id);
  });

  it("deve permitir abrir e fechar a listagem de contatos", async () => {
    const context = createMockAuthContext({
      contacts: [mockedContact],
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={context}>
          <DashboardContact />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    const toggleButton = screen.getByRole("button", {
      name: "Search Contacts!",
    });

    fireEvent.click(toggleButton);

    expect(
      await screen.findByText("Name: Contato de Teste"),
    ).toBeInTheDocument();

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Name: Contato de Teste"),
      ).not.toBeInTheDocument();
    });
  });
});

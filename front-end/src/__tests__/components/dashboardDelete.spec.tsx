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
  createdAt: "2026-10-01",
  updatedAt: "2026-10-01",
  contact: [],
};

const mockedContact: IContact = {
  id: "550e8400-e29b-41d4-a716-446655440002",
  name: "Contato de Teste",
  email: "contato@email.com",
  telephone: "51988888888",
  createdAt: "2026-10-01",
  updatedAt: "2026-10-01",
};

describe("Exclusao com confirmacao no Dashboard", () => {
  it("deve excluir o cliente somente apos confirmar", async () => {
    const deleteClientMock = vi.fn(async () => true);

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

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete Client",
      }),
    );

    expect(deleteClientMock).not.toHaveBeenCalled();

    expect(
      screen.getByRole("dialog", {
        name: "Delete Client?",
      }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Confirm Delete Client",
      }),
    );

    await waitFor(() => {
      expect(deleteClientMock).toHaveBeenCalledWith(mockedClient.id);
    });
  });

  it("deve permitir cancelar a exclusao do cliente", async () => {
    const deleteClientMock = vi.fn(async () => true);

    const context = createMockAuthContext({
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

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Delete Client",
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(deleteClientMock).not.toHaveBeenCalled();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("deve excluir contato somente apos confirmar", async () => {
    const deleteContactMock = vi.fn(async () => true);

    const context = createMockAuthContext({
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

    expect(deleteContactMock).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Confirm Delete Contact",
      }),
    );

    await waitFor(() => {
      expect(deleteContactMock).toHaveBeenCalledWith(mockedContact.id);
    });
  });

  it("deve manter o modal aberto quando a exclusao falhar", async () => {
    const deleteContactMock = vi.fn(async () => false);

    const context = createMockAuthContext({
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

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Delete Contact",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Confirm Delete Contact",
      }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to delete. Please try again.",
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("deve permitir fechar a listagem de contatos", async () => {
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

    const button = screen.getByRole("button", {
      name: "Search Contacts!",
    });

    fireEvent.click(button);

    expect(
      await screen.findByText("Name: Contato de Teste"),
    ).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.queryByText("Name: Contato de Teste"),
      ).not.toBeInTheDocument();
    });
  });
});

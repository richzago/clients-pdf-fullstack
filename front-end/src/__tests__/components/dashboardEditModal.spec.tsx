import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { afterEach, describe, expect, it, vi } from "vitest";

import { MemoryRouter } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";

import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { DashboardClient } from "../../components/dashboard/client";
import { DashboardContact } from "../../components/dashboard/contact";
import { createMockAuthContext } from "../utils/createMockAuthContext";

import type { IClientsList, IContact } from "../../interfaces/client";

const apiMock = new MockAdapter(api);

const client: IClientsList = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "Cliente Original",
  email: "cliente@email.com",
  telephone: "51999999999",
  createdAt: "2026-10-01",
  updatedAt: "2026-10-01",
  contact: [],
};

const contact: IContact = {
  id: "550e8400-e29b-41d4-a716-446655440002",
  name: "Contato Original",
  email: "contato@email.com",
  telephone: "51988888888",
  createdAt: "2026-10-01",
  updatedAt: "2026-10-01",
};

afterEach(() => {
  apiMock.reset();
  localStorage.clear();
});

describe("Modais de edicao do Dashboard", () => {
  it("deve abrir a edicao do cliente correto", async () => {
    const context = createMockAuthContext({
      clients: [client],
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
        name: "Edit Client",
      }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Edit Client",
    });

    expect(dialog).toBeInTheDocument();

    expect(screen.getByLabelText("Name")).toHaveValue("Cliente Original");

    expect(screen.getByLabelText("Email")).toHaveValue("cliente@email.com");

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("deve atualizar o contato selecionado e fechar o modal", async () => {
    localStorage.setItem("@TOKEN", "token-de-teste");

    apiMock.onPatch(`/contacts/${contact.id}`).reply(200, {
      ...contact,
      name: "Contato Atualizado",
    });

    const listContactsMock = vi.fn(async () => {});

    const context = createMockAuthContext({
      contacts: [contact],
      listContacts: listContactsMock,
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
        name: "Edit Contact",
      }),
    );

    expect(
      screen.getByRole("dialog", {
        name: "Edit Contact",
      }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Contato Atualizado" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() => {
      expect(apiMock.history.patch).toHaveLength(1);
    });

    expect(apiMock.history.patch[0].url).toBe(`/contacts/${contact.id}`);

    expect(JSON.parse(apiMock.history.patch[0].data)).toEqual({
      name: "Contato Atualizado",
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    expect(listContactsMock).toHaveBeenCalledTimes(2);
  });

  it("deve fechar a edicao ao pressionar Escape", async () => {
    const context = createMockAuthContext({
      clients: [client],
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
        name: "Edit Client",
      }),
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import ClientDashboardPage from "../../pages/clientDashboard/clientDashboardPage";
import { DashboardContact } from "../../components/dashboard/contact";
import { AuthContext } from "../../contexts/AuthContext";
import { createMockAuthContext } from "../utils/createMockAuthContext";

import type { IContact } from "../../interfaces/client";

const mockedContacts: IContact[] = Array.from({ length: 12 }, (_, index) => ({
  id: `contact-${index + 1}`,
  name: `Contato ${index + 1}`,
  email: `contato${index + 1}@email.com`,
  telephone: "51999999999",
  createdAt: "2026-10-01",
  updatedAt: "2026-10-01",
}));

describe("Layout do Dashboard", () => {
  it("deve renderizar as secoes principais", () => {
    const context = createMockAuthContext({
      isAuthenticated: true,
    });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={context}>
          <ClientDashboardPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("main")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Register Contact" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("region", { name: "Contacts" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  it("deve organizar multiplos contatos em uma lista", async () => {
    const listContactsMock = vi.fn(async () => {});

    const context = createMockAuthContext({
      isAuthenticated: true,
      contacts: mockedContacts,
      listContacts: listContactsMock,
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

    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggleButton);

    const contactsList = await screen.findByRole("list", {
      name: "Contacts list",
    });

    expect(within(contactsList).getAllByRole("listitem")).toHaveLength(12);

    expect(
      within(contactsList).getByText("Name: Contato 12"),
    ).toBeInTheDocument();

    expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    expect(listContactsMock).toHaveBeenCalledTimes(1);
  });

  it("deve fechar a lista sem excluir os contatos", async () => {
    const context = createMockAuthContext({
      contacts: mockedContacts,
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
      await screen.findByRole("list", {
        name: "Contacts list",
      }),
    ).toBeInTheDocument();

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(
        screen.queryByRole("list", {
          name: "Contacts list",
        }),
      ).not.toBeInTheDocument();
    });

    expect(context.deleteContact).not.toHaveBeenCalled();
  });
});

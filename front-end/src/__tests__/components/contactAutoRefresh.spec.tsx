import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";

import api from "../../services/api";
import AuthProvider from "../../contexts/AuthContext";

import FormContactRegister from "../../components/forms/formContact";
import { DashboardContact } from "../../components/dashboard/contact";

import type { IContact } from "../../interfaces/client";

const apiMock = new MockAdapter(api);

afterEach(() => {
  apiMock.reset();
  localStorage.clear();
});

describe("Atualizacao automatica de contatos", () => {
  it("deve atualizar a lista apos cadastrar um contato", async () => {
    localStorage.setItem("@TOKEN", "token-de-teste");

    // Simula os contatos armazenados no Back-end.
    const storedContacts: IContact[] = [];

    // GET retorna a lista atual do servidor.
    apiMock.onGet("/contacts").reply(() => {
      return [200, [...storedContacts]];
    });

    // POST adiciona o novo contato ao servidor simulado.
    apiMock.onPost("/contacts").reply((config) => {
      const data = JSON.parse(config.data);

      const newContact: IContact = {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: data.name,
        email: data.email,
        telephone: data.telephone,
        createdAt: "2026-10-26T10:00:00.000Z",
        updatedAt: "2026-10-26T10:00:00.000Z",
      };

      storedContacts.push(newContact);

      return [201, newContact];
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <FormContactRegister />
          <DashboardContact />
        </AuthProvider>
      </MemoryRouter>,
    );

    // Abre a lista inicialmente vazia.
    fireEvent.click(
      screen.getByRole("button", {
        name: "Search Contacts!",
      }),
    );

    expect(
      await screen.findByText("There are no contacts to show"),
    ).toBeInTheDocument();

    // Preenche e envia o formulário.
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "Maria Silva" },
    });

    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "51999999999" },
    });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "maria@email.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    // O contato deve aparecer sem clicar em Search Contacts novamente.
    expect(await screen.findByText("Name: Maria Silva")).toBeInTheDocument();

    await waitFor(() => {
      expect(apiMock.history.post).toHaveLength(1);

      // Um GET inicial e outro depois do POST.
      expect(apiMock.history.get).toHaveLength(2);
    });

    expect(
      screen.queryByText("There are no contacts to show"),
    ).not.toBeInTheDocument();
  });
});

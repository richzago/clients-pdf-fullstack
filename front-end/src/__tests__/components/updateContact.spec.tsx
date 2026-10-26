import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import MockAdapter from "axios-mock-adapter";

import UpdateContactForm from "../../components/forms/updateContact";
import api from "../../services/api";
import type { IContact } from "../../interfaces/client";

// Intercepta as requisições da instância Axios real.
const apiMock = new MockAdapter(api);

// Contato fictício utilizado nos testes.
const mockedContact: IContact = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Contato Original",
  email: "contato@email.com",
  telephone: "51999999999",
  createdAt: "2026-10-01T10:00:00.000Z",
  updatedAt: "2026-10-01T10:00:00.000Z",
};

const renderForm = () => {
  const onClose = vi.fn();
  const onUpdated = vi.fn(async () => {});

  render(
    <UpdateContactForm
      contact={mockedContact}
      onClose={onClose}
      onUpdated={onUpdated}
    />,
  );

  return { onClose, onUpdated };
};

const submitForm = () => {
  fireEvent.click(
    screen.getByRole("button", {
      name: "Update",
    }),
  );
};

beforeEach(() => {
  localStorage.setItem("@TOKEN", "token-de-teste");

  apiMock.onPatch(`/contacts/${mockedContact.id}`).reply(200, {
    ...mockedContact,
  });
});

afterEach(() => {
  apiMock.reset();
  localStorage.clear();
});

describe("UpdateContactForm", () => {
  it("deve atualizar somente o nome modificado", async () => {
    const { onClose, onUpdated } = renderForm();

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Contato Atualizado" },
    });

    submitForm();

    await waitFor(() => {
      expect(apiMock.history.patch).toHaveLength(1);
    });

    const request = apiMock.history.patch[0];

    expect(request.url).toBe(`/contacts/${mockedContact.id}`);

    expect(JSON.parse(request.data)).toEqual({
      name: "Contato Atualizado",
    });

    await waitFor(() => {
      expect(onUpdated).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("deve atualizar somente nome e telefone", async () => {
    renderForm();

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Novo Contato" },
    });

    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "51988888888" },
    });

    submitForm();

    await waitFor(() => {
      expect(apiMock.history.patch).toHaveLength(1);
    });

    const request = apiMock.history.patch[0];

    expect(JSON.parse(request.data)).toEqual({
      name: "Novo Contato",
      telephone: "51988888888",
    });
  });

  it("nao deve enviar PATCH quando nenhum campo for alterado", async () => {
    const { onUpdated } = renderForm();

    submitForm();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Update" })).not.toBeDisabled();
    });

    expect(apiMock.history.patch).toHaveLength(0);
    expect(onUpdated).not.toHaveBeenCalled();
  });

  it("nao deve sobrescrever um campo com string vazia", async () => {
    renderForm();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Contato Novo" },
    });

    submitForm();

    await waitFor(() => {
      expect(apiMock.history.patch).toHaveLength(1);
    });

    const request = apiMock.history.patch[0];

    expect(JSON.parse(request.data)).toEqual({
      name: "Contato Novo",
    });
  });
});

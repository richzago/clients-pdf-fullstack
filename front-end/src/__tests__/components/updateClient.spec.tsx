import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import MockAdapter from "axios-mock-adapter";

import UpdateClientForm from "../../components/forms/updateClient";
import api from "../../services/api";
import type { IClientsList } from "../../interfaces/client";

const apiMock = new MockAdapter(api);

const mockedClient: IClientsList = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "Richard Original",
  email: "richard@email.com",
  telephone: "51999999999",
  createdAt: "2026-10-01T10:00:00.000Z",
  updatedAt: "2026-10-01T10:00:00.000Z",
  contact: [],
};

const renderForm = () => {
  const onClose = vi.fn();
  const onUpdated = vi.fn(async () => {});

  render(
    <UpdateClientForm
      client={mockedClient}
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

  apiMock.onPatch(`/clients/${mockedClient.id}`).reply(200, {
    message: "Update successful",
  });
});

afterEach(() => {
  apiMock.reset();
  localStorage.clear();
});

describe("UpdateClientForm", () => {
  it("deve enviar somente o nome alterado", async () => {
    const { onClose, onUpdated } = renderForm();

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Richard Atualizado" },
    });

    submitForm();

    await waitFor(() => {
      expect(apiMock.history.patch).toHaveLength(1);
    });

    const request = apiMock.history.patch[0];

    expect(request.url).toBe(`/clients/${mockedClient.id}`);

    expect(JSON.parse(request.data)).toEqual({
      name: "Richard Atualizado",
    });

    await waitFor(() => {
      expect(onUpdated).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("deve enviar somente email e telefone alterados", async () => {
    renderForm();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "novo@email.com" },
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
      email: "novo@email.com",
      telephone: "51988888888",
    });
  });

  it("nao deve enviar PATCH sem alteracoes", async () => {
    const { onClose, onUpdated } = renderForm();

    submitForm();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Update" })).not.toBeDisabled();
    });

    expect(apiMock.history.patch).toHaveLength(0);
    expect(onUpdated).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("nao deve enviar um campo apagado como string vazia", async () => {
    renderForm();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Novo Richard" },
    });

    submitForm();

    await waitFor(() => {
      expect(apiMock.history.patch).toHaveLength(1);
    });

    expect(JSON.parse(apiMock.history.patch[0].data)).toEqual({
      name: "Novo Richard",
    });
  });

  it("nao deve fechar o modal quando a API retornar 409", async () => {
    apiMock.reset();

    apiMock.onPatch(`/clients/${mockedClient.id}`).reply(409, {
      message: "Email already exists",
    });

    const { onClose, onUpdated } = renderForm();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "duplicado@email.com" },
    });

    submitForm();

    await waitFor(() => {
      expect(apiMock.history.patch).toHaveLength(1);
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Update",
        }),
      ).not.toBeDisabled();
    });

    expect(onUpdated).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("deve fechar o modal sem enviar PATCH ao clicar no X", () => {
    const { onClose, onUpdated } = renderForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: "X",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onUpdated).not.toHaveBeenCalled();
    expect(apiMock.history.patch).toHaveLength(0);
  });
});

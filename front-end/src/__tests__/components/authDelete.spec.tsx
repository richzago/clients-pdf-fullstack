import { useContext } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { afterEach, describe, expect, it, vi } from "vitest";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";

import api from "../../services/api";
import AuthProvider, { AuthContext } from "../../contexts/AuthContext";

const apiMock = new MockAdapter(api);

const CLIENT_ID = "550e8400-e29b-41d4-a716-446655440001";
const CONTACT_ID = "550e8400-e29b-41d4-a716-446655440002";

const DeleteActions = () => {
  const { deleteClient, deleteContact } = useContext(AuthContext);

  return (
    <>
      <button onClick={() => deleteClient(CLIENT_ID)}>
        Excluir cliente de teste
      </button>

      <button onClick={() => deleteContact(CONTACT_ID)}>
        Excluir contato de teste
      </button>
    </>
  );
};

const renderActions = () => {
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <AuthProvider>
        <Routes>
          <Route path="/dashboard" element={<DeleteActions />} />

          <Route path="/login" element={<p>Página de login</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
};

afterEach(() => {
  apiMock.reset();
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("Exclusao no AuthContext", () => {
  it("deve enviar DELETE de contato com token e UUID corretos", async () => {
    localStorage.setItem("@TOKEN", "token-de-teste");

    apiMock.onDelete(`/contacts/${CONTACT_ID}`).reply(204);

    renderActions();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Excluir contato de teste",
      }),
    );

    await waitFor(() => {
      expect(apiMock.history.delete).toHaveLength(1);
    });

    const request = apiMock.history.delete[0];

    expect(request.url).toBe(`/contacts/${CONTACT_ID}`);
    expect(request.headers?.Authorization).toBe("Bearer token-de-teste");
  });

  it("deve enviar DELETE de cliente com token e UUID corretos", async () => {
    localStorage.setItem("@TOKEN", "token-de-teste");

    apiMock.onDelete(`/clients/${CLIENT_ID}`).reply(204);

    renderActions();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Excluir cliente de teste",
      }),
    );

    await waitFor(() => {
      expect(apiMock.history.delete).toHaveLength(1);
    });

    const request = apiMock.history.delete[0];

    expect(request.url).toBe(`/clients/${CLIENT_ID}`);
    expect(request.headers?.Authorization).toBe("Bearer token-de-teste");

    expect(await screen.findByText("Página de login")).toBeInTheDocument();
  });

  it("nao deve enviar DELETE sem token", async () => {
    localStorage.removeItem("@TOKEN");

    // O AuthProvider redireciona ao login sem token.
    renderActions();

    expect(await screen.findByText("Página de login")).toBeInTheDocument();

    expect(apiMock.history.delete).toHaveLength(0);
  });

  it("nao deve redirecionar apos falha ao excluir contato", async () => {
    localStorage.setItem("@TOKEN", "token-de-teste");

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    apiMock.onDelete(`/contacts/${CONTACT_ID}`).reply(403, {
      message: "Forbidden",
    });

    renderActions();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Excluir contato de teste",
      }),
    );

    await waitFor(() => {
      expect(apiMock.history.delete).toHaveLength(1);
      expect(consoleSpy).toHaveBeenCalled();
    });

    expect(screen.queryByText("Página de login")).not.toBeInTheDocument();
  });
});

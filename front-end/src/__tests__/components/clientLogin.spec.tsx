import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import type { ContextType } from "react";

import LoginClient from "../../components/forms/loginClient";
import { AuthContext } from "../../contexts/AuthContext";

describe("LoginClient", () => {
  it("deve enviar email e senha para o contexto de autenticacao", async () => {
    // ARRANGE: preparar as dependências do teste
    const clientLoginMock = vi.fn();

    const contextValue: ContextType<typeof AuthContext> = {
      clientLogin: clientLoginMock,
      clientRegister: vi.fn(),
      listClients: vi.fn(),
      listContacts: vi.fn(),
      deleteClient: vi.fn(),
      deleteContact: vi.fn(),
      contactRegister: vi.fn(),

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
    };

    render(
      <MemoryRouter>
        <AuthContext.Provider value={contextValue}>
          <LoginClient />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // ACT: simular a interação do usuário
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    const submitButton = screen.getByRole("button", {
      name: "Login",
    });

    fireEvent.change(emailInput, {
      target: { value: "teste@email.com" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "12345678" },
    });

    fireEvent.click(submitButton);

    // ASSERT: verificar o resultado
    await waitFor(() => {
      expect(clientLoginMock).toHaveBeenCalledTimes(1);

      expect(clientLoginMock).toHaveBeenCalledWith({
        email: "teste@email.com",
        password: "12345678",
      });
    });
  });
});

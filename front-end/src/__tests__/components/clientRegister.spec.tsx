import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import type { ContextType } from "react";

import { FormClientRegister } from "../../components/forms/formClient";
import { AuthContext } from "../../contexts/AuthContext";

describe("FormClientRegister", () => {
  const renderForm = () => {
    const clientRegisterMock = vi.fn();

    const contextValue: ContextType<typeof AuthContext> = {
      clientRegister: clientRegisterMock,
      clientLogin: vi.fn(),
      contactRegister: vi.fn(),
      listClients: vi.fn(),
      listContacts: vi.fn(),
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
    };

    render(
      <MemoryRouter>
        <AuthContext.Provider value={contextValue}>
          <FormClientRegister />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    return clientRegisterMock;
  };

  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "Richard Zago" },
    });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "richard@email.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "51999999999" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "12345678" },
    });
  };

  it("deve enviar os dados validos para cadastro", async () => {
    const clientRegisterMock = renderForm();

    fillForm();

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(clientRegisterMock).toHaveBeenCalledWith({
        name: "Richard Zago",
        email: "richard@email.com",
        telephone: "51999999999",
        password: "12345678",
      });
    });
  });

  it("nao deve cadastrar cliente com campos vazios", async () => {
    const clientRegisterMock = renderForm();

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(
      await screen.findByText("Name must contain at least 4 characters"),
    ).toBeInTheDocument();

    expect(screen.getByText("Email is required")).toBeInTheDocument();

    expect(screen.getByText("Telephone is required")).toBeInTheDocument();

    expect(screen.getByText("Password is required")).toBeInTheDocument();

    expect(clientRegisterMock).not.toHaveBeenCalled();
  });

  it("nao deve cadastrar cliente com email invalido", async () => {
    const clientRegisterMock = renderForm();

    fillForm();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "email-invalido" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(await screen.findByText("Invalid email")).toBeInTheDocument();

    expect(clientRegisterMock).not.toHaveBeenCalled();
  });
});

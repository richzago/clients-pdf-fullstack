import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import type { ContextType } from "react";

import FormContactRegister from "../../components/forms/formContact";
import { AuthContext } from "../../contexts/AuthContext";

describe("FormContactRegister", () => {
  const renderForm = () => {
    const contactRegisterMock = vi.fn();

    const contextValue: ContextType<typeof AuthContext> = {
      clientRegister: vi.fn(),
      clientLogin: vi.fn(),
      contactRegister: contactRegisterMock,

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
      isAuthenticated: true,
      setIsAuthenticated: vi.fn(),
    };

    render(
      <MemoryRouter>
        <AuthContext.Provider value={contextValue}>
          <FormContactRegister />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    return contactRegisterMock;
  };

  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "Contato Teste" },
    });

    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "51999999999" },
    });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "contato@email.com" },
    });
  };

  it("deve enviar os dados validos para cadastro", async () => {
    const contactRegisterMock = renderForm();

    fillForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Register",
      }),
    );

    await waitFor(() => {
      expect(contactRegisterMock).toHaveBeenCalledTimes(1);

      expect(contactRegisterMock).toHaveBeenCalledWith({
        name: "Contato Teste",
        telephone: "51999999999",
        email: "contato@email.com",
      });
    });
  });

  it("nao deve cadastrar contato com campos vazios", async () => {
    const contactRegisterMock = renderForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Register",
      }),
    );

    // Conforme a validacao atual do Yup
    expect(
      await screen.findByText("Name must contain at least 4 characters"),
    ).toBeInTheDocument();

    expect(screen.getByText("Email is required")).toBeInTheDocument();

    expect(screen.getByText("Telephone is required")).toBeInTheDocument();

    expect(contactRegisterMock).not.toHaveBeenCalled();
  });

  it("nao deve cadastrar contato com email invalido", async () => {
    const contactRegisterMock = renderForm();

    fillForm();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "email-invalido" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Register",
      }),
    );

    expect(await screen.findByText("Invalid email")).toBeInTheDocument();

    expect(contactRegisterMock).not.toHaveBeenCalled();
  });

  it("nao deve cadastrar contato com nome muito curto", async () => {
    const contactRegisterMock = renderForm();

    fillForm();

    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "Ana" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Register",
      }),
    );

    expect(
      await screen.findByText("Name must contain at least 4 characters"),
    ).toBeInTheDocument();

    expect(contactRegisterMock).not.toHaveBeenCalled();
  });
});

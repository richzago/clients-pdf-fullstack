import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { describe, expect, it, vi } from "vitest";

import FormContactRegister from "../../components/forms/formContact";
import { AuthContext } from "../../contexts/AuthContext";

import { createMockAuthContext } from "../utils/createMockAuthContext";

const renderRegister = () => {
  const contactRegisterMock = vi.fn();

  const context = createMockAuthContext({
    isAuthenticated: true,
    contactRegister: contactRegisterMock,
  });

  render(
    <AuthContext.Provider value={context}>
      <FormContactRegister />
    </AuthContext.Provider>,
  );

  return contactRegisterMock;
};

describe("Interface do cadastro de contatos", () => {
  it("deve exibir os campos com rotulos acessiveis", () => {
    renderRegister();

    expect(
      screen.getByRole("textbox", { name: "Full Name" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: "Phone" })).toHaveAttribute(
      "type",
      "tel",
    );

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "type",
      "email",
    );
  });

  it("deve exibir erro acessivel para email invalido", async () => {
    const contactRegisterMock = renderRegister();

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Contato Teste" },
    });

    fireEvent.change(screen.getByLabelText("Phone"), {
      target: { value: "51999999999" },
    });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "email-invalido" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    const error = await screen.findByText("Invalid email");

    expect(error).toHaveAttribute("role", "alert");

    const emailInput = screen.getByLabelText("Email");

    expect(emailInput).toHaveAttribute("aria-invalid", "true");

    expect(emailInput).toHaveAttribute(
      "aria-describedby",
      "contact-email-error",
    );

    expect(contactRegisterMock).not.toHaveBeenCalled();
  });

  it("deve bloquear o cadastro com campos vazios", async () => {
    const contactRegisterMock = renderRegister();

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();

    expect(screen.getByText("Telephone is required")).toBeInTheDocument();

    expect(contactRegisterMock).not.toHaveBeenCalled();
  });

  it("deve enviar os dados validos ao contexto", async () => {
    const contactRegisterMock = renderRegister();

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Maria Silva" },
    });

    fireEvent.change(screen.getByLabelText("Phone"), {
      target: { value: "51988888888" },
    });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "maria@email.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(contactRegisterMock).toHaveBeenCalledTimes(1);

      expect(contactRegisterMock).toHaveBeenCalledWith({
        name: "Maria Silva",
        telephone: "51988888888",
        email: "maria@email.com",
      });
    });
  });
});

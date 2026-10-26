import { fireEvent, render, screen } from "@testing-library/react";

import { describe, expect, it, vi } from "vitest";

import { MemoryRouter, Route, Routes } from "react-router-dom";

import { FormClientRegister } from "../../components/forms/formClient";
import { AuthContext } from "../../contexts/AuthContext";

import { createMockAuthContext } from "../utils/createMockAuthContext";

const renderRegister = () => {
  const clientRegisterMock = vi.fn();

  const context = createMockAuthContext({
    clientRegister: clientRegisterMock,
  });

  render(
    <MemoryRouter initialEntries={["/clients"]}>
      <AuthContext.Provider value={context}>
        <Routes>
          <Route path="/clients" element={<FormClientRegister />} />

          <Route path="/login" element={<h1>Pagina de login</h1>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  );

  return clientRegisterMock;
};

describe("Interface do cadastro de clientes", () => {
  it("deve exibir todos os campos com rotulos", () => {
    renderRegister();

    expect(
      screen.getByRole("textbox", { name: "Full Name" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: "Phone" })).toBeInTheDocument();

    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("deve mostrar erro acessivel para email invalido", async () => {
    const clientRegisterMock = renderRegister();

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Cliente Teste" },
    });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "email-invalido" },
    });

    fireEvent.change(screen.getByLabelText("Phone"), {
      target: { value: "51999999999" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "12345678" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    const error = await screen.findByText("Invalid email");

    expect(error).toHaveAttribute("role", "alert");

    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    expect(clientRegisterMock).not.toHaveBeenCalled();
  });

  it("deve voltar para o login ao clicar em Back", () => {
    renderRegister();

    fireEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByText("Pagina de login")).toBeInTheDocument();
  });

  it("nao deve enviar cadastro quando os campos estiverem vazios", async () => {
    const clientRegisterMock = renderRegister();

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();

    expect(screen.getByText("Password is required")).toBeInTheDocument();

    expect(clientRegisterMock).not.toHaveBeenCalled();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";

import { describe, expect, it, vi } from "vitest";

import { MemoryRouter, Route, Routes } from "react-router-dom";

import LoginClient from "../../components/forms/loginClient";
import { AuthContext } from "../../contexts/AuthContext";
import { createMockAuthContext } from "../utils/createMockAuthContext";

const renderLogin = () => {
  const clientLoginMock = vi.fn();

  const context = createMockAuthContext({
    clientLogin: clientLoginMock,
  });

  render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthContext.Provider value={context}>
        <Routes>
          <Route path="/login" element={<LoginClient />} />

          <Route path="/clients" element={<h1>Pagina de cadastro</h1>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  );

  return clientLoginMock;
};

describe("Interface do LoginClient", () => {
  it("deve apresentar campos com rotulos acessiveis", () => {
    renderLogin();

    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();

    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("deve ocultar a senha inicialmente", () => {
    renderLogin();

    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("deve mostrar e ocultar a senha", () => {
    renderLogin();

    const passwordInput = screen.getByLabelText("Password");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Show password",
      }),
    );

    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Hide password",
      }),
    );

    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("nao deve enviar o login ao clicar no botao da senha", () => {
    const clientLoginMock = renderLogin();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Show password",
      }),
    );

    expect(clientLoginMock).not.toHaveBeenCalled();
  });

  it("deve navegar para cadastro ao clicar em Register", () => {
    renderLogin();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Register",
      }),
    );

    expect(screen.getByText("Pagina de cadastro")).toBeInTheDocument();
  });
});


import { afterEach, describe, expect, it } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import MockAdapter from "axios-mock-adapter";

import api from "../../services/api";
import AuthProvider from "../../contexts/AuthContext";
import LoginClient from "../../components/forms/loginClient";

const apiMock = new MockAdapter(api);

const renderLogin = () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginClient />} />
          <Route
            path="/dashboard"
            element={<h1>Dashboard de teste</h1>}
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

const fillLoginForm = () => {
  fireEvent.change(
    screen.getByPlaceholderText("Email"),
    { target: { value: "teste@email.com" } }
  );

  fireEvent.change(
    screen.getByPlaceholderText("Password"),
    { target: { value: "12345678" } }
  );

  fireEvent.click(
    screen.getByRole("button", { name: "Login" })
  );
};

afterEach(() => {
  apiMock.reset();
});

describe("Autenticacao de cliente", () => {
  it("deve armazenar o token e navegar para o dashboard", async () => {
    // Arrange: simula uma resposta HTTP de sucesso
    apiMock.onPost("/login").reply(200, {
      token: "token-de-teste",
    });

    renderLogin();

    // Act: realiza o login
    fillLoginForm();

    // Assert: verifica o token e a navegação
    await waitFor(() => {
      expect(localStorage.getItem("@TOKEN")).toBe(
        "token-de-teste"
      );

      expect(
        screen.getByText("Dashboard de teste")
      ).toBeInTheDocument();
    });
  });

  it("nao deve autenticar com credenciais invalidas", async () => {
    // Arrange: simula credenciais incorretas
    apiMock.onPost("/login").reply(401, {
      message: "Invalid credentials",
    });

    renderLogin();

    // Act
    fillLoginForm();

    // Assert: verifica se a chamada foi realizada
    await waitFor(() => {
      expect(apiMock.history.post).toHaveLength(1);
    });

    expect(localStorage.getItem("@TOKEN")).toBeNull();

    expect(
      screen.queryByText("Dashboard de teste")
    ).not.toBeInTheDocument();
  });
});

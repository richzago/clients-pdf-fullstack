import { render, screen } from "@testing-library/react";

import { describe, expect, it } from "vitest";

import { MemoryRouter, Route, Routes } from "react-router-dom";

import ProtectedRoutes from "../../components/ProtectedRoutes";
import { AuthContext } from "../../contexts/AuthContext";
import { createMockAuthContext } from "../utils/createMockAuthContext";

const renderRoutes = (isAuthenticated: boolean) => {
  const context = createMockAuthContext({
    isAuthenticated,
  });

  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <AuthContext.Provider value={context}>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<h1>Dashboard privado</h1>} />
          </Route>

          <Route path="/login" element={<h1>Página pública</h1>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
};

describe("ProtectedRoutes", () => {
  it("deve permitir acesso quando o usuario estiver autenticado", () => {
    renderRoutes(true);

    expect(screen.getByText("Dashboard privado")).toBeInTheDocument();
  });

  it("nao deve renderizar o dashboard sem autenticacao", () => {
    renderRoutes(false);

    expect(screen.queryByText("Dashboard privado")).not.toBeInTheDocument();
  });
});

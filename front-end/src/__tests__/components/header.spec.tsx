import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Header } from "../../components/header";

describe("Header", () => {
  it("deve exibir o nome da aplicacao", () => {
    render(<Header />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Clients Project",
      }),
    ).toBeInTheDocument();
  });

  it("deve exibir o subtitulo", () => {
    render(<Header />);

    expect(
      screen.getByText("Client and contact management"),
    ).toBeInTheDocument();
  });

  it("deve renderizar um cabecalho semantico", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});

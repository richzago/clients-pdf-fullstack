
import "dotenv/config";
import app from "./app";
import { AppDataSource } from "./data-source";

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();

    console.log("Banco de dados conectado com sucesso.");

    const server = app.listen(PORT, () => {
      console.log(`Servidor executando na porta ${PORT}`);
    });

    server.on("error", (error: Error) => {
      console.error("Erro ao iniciar servidor HTTP:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
    process.exit(1);
  }
};

startServer();

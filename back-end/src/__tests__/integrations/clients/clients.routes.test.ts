import request from "supertest";
import app from "../../../app";
import { DataSource } from "typeorm";

import { mockedCreateClient, mockedLogin } from "../../mocks/clients";
import { AppDataSource } from "../../../data-source";

jest.mock("../../../utils/convertToPDF", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.setTimeout(30000);

describe("/clients", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((error) => {
        console.log("Error during Data Source initialization", error);
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /clients -> Must be able to create an client", async () => {
    const response = await request(app)
      .post("/clients")
      .send(mockedCreateClient);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("telephone");
  });

  test("POST /clients -> Should not be able to create an already existing client", async () => {
    const response = await request(app)
      .post("/clients")
      .send(mockedCreateClient);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(409);
  });

  test("GET /clients -> Should be able to list all clients", async () => {
    const resultLogin = await request(app).post("/login").send(mockedLogin);
    const response = await request(app)
      .get("/clients")
      .set("Authorization", `Bearer ${resultLogin.body.token}`);
    expect(response.body).toHaveLength(1);
  });

  test("GET /clients -> Should not be able to list clients without auth", async () => {
    const response = await request(app)
      .get("/clients")
      .set("Authorization", `Bearer`);
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /clients/:id -  should be able to update client", async () => {
    const newValues = { name: "Richardzinho" };

    const clientLoginResponse = await request(app)
      .post("/login")
      .send(mockedLogin);
    const token = `Bearer ${clientLoginResponse.body.token}`;

    const clientTobeUpdateRequest = await request(app)
      .get("/clients")
      .set("Authorization", token);
    const clientTobeUpdateId = clientTobeUpdateRequest.body[0].id;

    const response = await request(app)
      .patch(`/clients/${clientTobeUpdateId}`)
      .set("Authorization", token)
      .send(newValues);

    const clientUpdated = await request(app)
      .get("/clients")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(clientUpdated.body[0].name).toEqual("Richardzinho");
    expect(clientUpdated.body[0]).not.toHaveProperty("password");
  });

  test(`PATCH /clients/:id - Shouldn't be able to change an client if not authenticated`, async () => {
    const clientLoginResponse = await request(app)
      .post("/login")
      .send(mockedLogin);
    const clientToBeUpdate = await request(app)
      .get("/clients")
      .set("Authorization", `Bearer ${clientLoginResponse.body.token}`);
    const response = await request(app).patch(
      `/clients/${clientToBeUpdate.body[0].id}`,
    );
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("DELETE /clients/:id -  should not be able to delete client without authentication", async () => {
    const clientLoginResponse = await request(app)
      .post("/login")
      .send(mockedLogin);
    const clientTobeDeleted = await request(app)
      .get("/clients")
      .set("Authorization", `Bearer ${clientLoginResponse.body.token}`);

    const response = await request(app).delete(
      `/clients/${clientTobeDeleted.body[0].id}`,
    );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("DELETE /client/:id-  It should be possible to delete itself from the database", async () => {
    await request(app).post("/clients").send(mockedCreateClient);

    const clientLoginResponse = await request(app)
      .post("/login")
      .send(mockedLogin);
    const clientTobeDeleted = await request(app)
      .get("/clients")
      .set("Authorization", `Bearer ${clientLoginResponse.body.token}`);

    const response = await request(app)
      .delete(`/clients/${clientTobeDeleted.body[0].id}`)
      .set("Authorization", `Bearer ${clientLoginResponse.body.token}`);

    expect(response.status).toBe(204);
  });
});

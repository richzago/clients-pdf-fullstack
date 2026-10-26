import request from "supertest";
import app from "../../../app";
import { DataSource } from "typeorm";

import { mockedCreateClient2, mockedLogin2 } from "../../mocks/clients";
import { AppDataSource } from "../../../data-source";
import { mockedCreateContact } from "../../mocks/contacts";

jest.mock("../../../utils/convertToPDF", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.setTimeout(30000);

describe("/contacts", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((error) => {
        console.log("Error during Data Source initialization", error);
      });
    await request(app).post("/clients").send(mockedCreateClient2);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /contacts -> Must be able to contact an client", async () => {
    const loginClient = await request(app).post("/login").send(mockedLogin2);
    const responseContact = await request(app)
      .post("/contacts")
      .send(mockedCreateContact)
      .set("Authorization", `Bearer ${loginClient.body.token}`);

    expect(responseContact.body).toHaveProperty("id");
    expect(responseContact.body).toHaveProperty("name");
    expect(responseContact.body).toHaveProperty("email");
    expect(responseContact.body).toHaveProperty("telephone");
    expect(responseContact.body).toHaveProperty("createdAt");
  });

  test("POST /contacts -> Should not be able to create an already existing contact", async () => {
    const loginClient = await request(app).post("/login").send(mockedLogin2);
    const responseContact = await request(app)
      .post("/contacts")
      .send(mockedCreateContact)
      .set("Authorization", `Bearer ${loginClient.body.token}`);

    expect(responseContact.body).toHaveProperty("message");
    expect(responseContact.status).toBe(409);
  });

  test("GET /contacts -> Should be able to list all contacts", async () => {
    const resultLogin = await request(app).post("/login").send(mockedLogin2);
    const response = await request(app)
      .get("/contacts")
      .set("Authorization", `Bearer ${resultLogin.body.token}`);
    expect(response.body).toHaveLength(1);
  });

  test("GET /contacts -> Should not be able to list contacts without auth", async () => {
    const response = await request(app)
      .get("/contacts")
      .set("Authorization", `Bearer`);
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /contacts/:id -  should be able to update contact", async () => {
    const newValues = { name: "Richardzinho" };

    const clientLoginResponse = await request(app)
      .post("/login")
      .send(mockedLogin2);
    const token = `Bearer ${clientLoginResponse.body.token}`;

    const contactTobeUpdateRequest = await request(app)
      .get("/contacts")
      .set("Authorization", token);
    const contactTobeUpdateId = contactTobeUpdateRequest.body[0].id;

    const response = await request(app)
      .patch(`/contacts/${contactTobeUpdateId}`)
      .set("Authorization", token)
      .send(newValues);

    const contactUpdated = await request(app)
      .get("/contacts")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(contactUpdated.body[0].name).toEqual("Richardzinho");
    expect(contactUpdated.body[0]).not.toHaveProperty("password");
  });

  test(`PATCH /contacts/:id - Shouldn't be able to change an contact if not authenticated`, async () => {
    const clientLoginResponse = await request(app)
      .post("/login")
      .send(mockedLogin2);
    const clientToBeUpdate = await request(app)
      .get("/contacts")
      .set("Authorization", `Bearer ${clientLoginResponse.body.token}`);
    const response = await request(app).patch(
      `/contacts/${clientToBeUpdate.body[0].id}`,
    );
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("DELETE /contacts/:id -  should not be able to delete contact without authentication", async () => {
    const clientLoginResponse = await request(app)
      .post("/login")
      .send(mockedLogin2);
    const contactTobeDeleted = await request(app)
      .get("/contacts")
      .set("Authorization", `Bearer ${clientLoginResponse.body.token}`);

    const response = await request(app).delete(
      `/contacts/${contactTobeDeleted.body[0].id}`,
    );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("DELETE /client/:id-  It should be possible to delete itself from the database", async () => {
    const clientLoginResponse = await request(app)
      .post("/login")
      .send(mockedLogin2);

    const responseContact = await request(app)
      .post("/contacts")
      .send(mockedCreateContact)
      .set("Authorization", `Bearer ${clientLoginResponse.body.token}`);

    const contactTobeDeleted = await request(app)
      .get("/contacts")
      .set("Authorization", `Bearer ${clientLoginResponse.body.token}`);

    const response = await request(app)
      .delete(`/contacts/${contactTobeDeleted.body[0].id}`)
      .set("Authorization", `Bearer ${clientLoginResponse.body.token}`);

    expect(response.status).toBe(204);
  });
});

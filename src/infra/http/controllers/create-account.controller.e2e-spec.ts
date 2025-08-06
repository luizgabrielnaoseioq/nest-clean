import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "@/infra/app.module";
import request from "supertest";

describe("Create account (E2E)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test("[POST] /accounts", async () => {
    const response = await request(app.getHttpServer()).post("/accounts").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123455",
    });

    expect(response.statusCode).toBe(201);
  });
});

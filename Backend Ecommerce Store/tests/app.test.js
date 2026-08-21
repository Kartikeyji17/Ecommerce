const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("App basic routes", () => {
  test("GET / returns API running message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("API Running");
  });

  test("GET /health returns 200", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
  });

  test("GET /api/products returns 200", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
  }, 15000);

  test("unknown route returns 404", async () => {
    const res = await request(app).get("/api/this-does-not-exist");
    expect(res.statusCode).toBe(404);
  });
});
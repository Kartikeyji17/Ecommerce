const request = require("supertest");
const express = require("express");
const healthRoutes = require("../routes/healthRoutes");

describe("health endpoint", () => {
  const app = express();
  app.use("/health", healthRoutes);

  it("returns status json", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("services");
  });
});

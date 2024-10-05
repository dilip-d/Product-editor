import request from "supertest";
import app from "./server";
import http from "http";
import axios from "axios";

jest.mock("axios");

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(5001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("GET /products", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and a list of products", async () => {
    const mockResponse = {
      data: {
        products: [
          { id: 1, title: "Product 1" },
          { id: 2, title: "Product 2" },
        ],
        total: 2,
      },
    };

    axios.get.mockResolvedValue(mockResponse);

    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.data);
    expect(axios.get).toHaveBeenCalledWith(
      "https://dummyjson.com/products?limit=194"
    );
  });

  it("should return 500 if there is an error fetching products", async () => {
    axios.get.mockRejectedValue(new Error("Error fetching products"));

    const response = await request(app).get("/products");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error fetching products");
  });
});

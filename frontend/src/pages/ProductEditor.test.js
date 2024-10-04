import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ProductEditor from "./ProductEditor";
import axios from "axios";

jest.mock("axios");

const productsMock = [
  {
    id: 1,
    title: "Product 1",
    description: "Desc 1",
    price: 100,
    brand: "Brand 1",
  },
  {
    id: 2,
    title: "Product 2",
    description: "Desc 2",
    price: 200,
    brand: "Brand 2",
  },
];

describe("ProductEditor", () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: { products: productsMock } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetches and displays products", async () => {
    render(<ProductEditor />);

    await waitFor(() => {
      expect(
        screen.getByRole("cell", { name: /Product 1/i })
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByRole("cell", { name: /Product 2/i })
      ).toBeInTheDocument();
    });
  });

  test("renders loading state", async () => {
    axios.get.mockImplementationOnce(() => new Promise(() => {}));

    render(<ProductEditor />);

    expect(screen.getByText("Loading products...")).toBeInTheDocument();
    axios.get.mockResolvedValueOnce({ data: { products: productsMock } });
    await waitFor(() => {
      expect(screen.queryByText("Loading products...")).not.toBeInTheDocument();
    });
  });

  test("filters products based on search term", async () => {
    render(<ProductEditor />);

    await waitFor(() => {
      expect(
        screen.getByRole("cell", { name: /Product 1/i })
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("Search products..."), {
      target: { value: "Product 1" },
    });

    await waitFor(() => {
      expect(
        screen.getByRole("cell", { name: /Product 1/i })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.queryByRole("cell", { name: /Product 2/i })
      ).not.toBeInTheDocument();
    });
  });
});

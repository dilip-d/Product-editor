import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders product list heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/product list/i);
  expect(headingElement).toBeInTheDocument();
});

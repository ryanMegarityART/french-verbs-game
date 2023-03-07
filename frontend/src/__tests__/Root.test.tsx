// Imports
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

// To Test
import { BrowserRouter } from "react-router-dom";
import { Root } from "../Root";

// Tests
describe("Renders main page correctly", async () => {
  it("Should render the page correctly", async () => {
    // Setup
    render(
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    );
    const h2 = screen.queryByText("Sign In");

    // Expectations
    expect(h2).not.toBeNull();
  });
});

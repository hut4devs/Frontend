import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AppShell, CapabilityPage, NotFoundPage } from "../src/app/router";

afterEach(cleanup);

describe("app shell", () => {
  it("provides accessible navigation for product capabilities", () => {
    render(<AppShell />);

    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Accommodation" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Payments" })).toBeTruthy();
    expect(screen.getByRole("main")).toBeTruthy();
  });
});

describe("capability pages", () => {
  it("renders a capability heading", () => {
    render(<CapabilityPage title="Accommodation" />);

    expect(screen.getByRole("heading", { name: "Accommodation" })).toBeTruthy();
  });
});

describe("not-found page", () => {
  it("explains the missing page and offers a home link", () => {
    render(<NotFoundPage />);

    expect(screen.getByRole("heading", { name: "Page not found" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Return home" })).toBeTruthy();
  });
});

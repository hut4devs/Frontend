import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { AppShell, CapabilityPage, LoadingState, NotFoundPage, RouteErrorPage } from "../src/app/router";

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

describe("semantic status communication", () => {
  it("announces loading with meaningful text and neutral styling", () => {
    render(<LoadingState />);
    const status = screen.getByRole("status");
    expect(status.textContent).toBe("Loading page");
    expect(status.classList.contains("text-neutral-foreground")).toBe(true);
    expect(status.classList.contains("bg-neutral-surface")).toBe(true);
  });

  it("announces route failure and retains an accessible recovery link", async () => {
    const router = createMemoryRouter([{
      path: "/",
      loader: () => { throw new Response("Unavailable", { status: 503, statusText: "Service unavailable" }); },
      element: <CapabilityPage title="Example" />,
      errorElement: <RouteErrorPage />,
      hydrateFallbackElement: <LoadingState />,
    }]);
    render(<RouterProvider router={router} />);
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("503");
    expect(alert.textContent).toContain("Service unavailable");
    expect(alert.classList.contains("text-danger-foreground")).toBe(true);
    expect(alert.classList.contains("bg-danger-surface")).toBe(true);
    expect(screen.getByRole("link", { name: "Return home" }).getAttribute("href")).toBe("/");
  });
});

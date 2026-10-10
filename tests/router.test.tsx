import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { AppShell, CapabilityPage, HomePage, NotFoundPage, RouteErrorPage } from "../src/app/router";

afterEach(cleanup);

function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <AppShell />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "accommodation/*", element: <CapabilityPage title="Accommodation" /> },
          { path: "members/*", element: <CapabilityPage title="Members" /> },
          { path: "payments/*", element: <CapabilityPage title="Payments" /> },
          { path: "support/*", element: <CapabilityPage title="Peer support" /> },
          { path: "trust-trails/*", element: <CapabilityPage title="Trust trails" /> },
          { path: "*", element: <NotFoundPage /> },
        ],
        errorElement: <RouteErrorPage />,
      },
    ],
    { initialEntries: [path] },
  );

  return render(<RouterProvider router={router} />);
}

describe("route matching", () => {
  it.each([
    ["/accommodation", "Accommodation"],
    ["/members", "Members"],
    ["/payments", "Payments"],
    ["/support", "Peer support"],
    ["/trust-trails", "Trust trails"],
  ])("routes %s to %s", (path, heading) => {
    renderAt(path);
    expect(screen.getByRole("heading", { name: heading })).toBeTruthy();
  });

  it("shows an accessible not-found page for unknown routes", () => {
    renderAt("/does-not-exist");
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeTruthy();
  });
});

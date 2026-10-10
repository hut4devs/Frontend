import {
  createBrowserRouter,
  Outlet,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";

export function AppShell() {
  return (
    <div>
      <header>
        <a href="/" aria-label="Hut4Devs home">Hut4Devs</a>
        <nav aria-label="Main navigation">
          <a href="/accommodation">Accommodation</a>
          <a href="/members">Members</a>
          <a href="/payments">Payments</a>
          <a href="/support">Peer support</a>
          <a href="/trust-trails">Trust trails</a>
        </nav>
      </header>
      <main id="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export function HomePage() {
  return (
    <section>
      <h1>Welcome to Hut4Devs</h1>
      <p>Transparent, collaborative support for our community.</p>
    </section>
  );
}

export function CapabilityPage({ title }: { title: string }) {
  return (
    <section>
      <h1>{title}</h1>
      <p>This area is ready for its product features.</p>
    </section>
  );
}

export function LoadingState() {
  return <p role="status">Loading page</p>;
}

export function RouteErrorPage() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status}  ${error.statusText || "Unable to load this page."}`
    : "Something went wrong while loading this page.";

  return (
    <section aria-labelledby="route-error-title">
      <h1 id="route-error-title">We couldn't load this page</h1>
      <p role="alert">{message}</p>
      <a href="/">Return home</a>
    </section>
  );
}

export function NotFoundPage() {
  return (
    <section aria-labelledby="not-found-title">
      <h1 id="not-found-title">Page not found</h1>
      <p>The page you requested doesn't exist or may have moved.</p>
      <a href="/">Return home</a>
    </section>
  );
}

function capability(title: string) {
  return {
    element: <CapabilityPage title={title} />,
    errorElement: <RouteErrorPage />,
    hydrateFallbackElement: <LoadingState />,
  };
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        errorElement: <RouteErrorPage />,
        hydrateFallbackElement: <LoadingState />,
      },
      { path: "accommodation/*", ...capability("Accommodation") },
      { path: "members/*", ...capability("Members") },
      { path: "payments/*", ...capability("Payments") },
      { path: "support/*", ...capability("Peer support") },
      { path: "trust-trails/*", ...capability("Trust trails") },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

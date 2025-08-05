import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png", type: "image/png" },
  { rel: "apple-touch-icon", href: "/favicon.png", sizes: "180x180" },
  { rel: "manifest", href: "/manifest.json" },
  { rel: "canonical", href: "https://libpostal.pendejo.dev" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "dns-prefetch",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Isaac Duarte" />
        <meta name="theme-color" content="#0969da" />
        <meta name="color-scheme" content="light dark" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://libpostal.pendejo.dev/" />
        <meta property="og:title" content="LibPostal API - Free Address Parsing & Normalization" />
        <meta property="og:description" content="Free REST API for parsing and normalizing addresses worldwide. Built on libpostal with high accuracy, supports international addresses, no API keys required." />
        <meta property="og:image" content="https://libpostal.pendejo.dev/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="LibPostal API" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://libpostal.pendejo.dev/" />
        <meta name="twitter:title" content="LibPostal API - Free Address Parsing & Normalization" />
        <meta name="twitter:description" content="Free REST API for parsing and normalizing addresses worldwide. Built on libpostal with high accuracy, supports international addresses, no API keys required." />
        <meta name="twitter:image" content="https://libpostal.pendejo.dev/og-image.jpg" />
        <meta name="twitter:creator" content="@IsaacDuarte" />
        
        {/* Additional SEO */}
        <meta name="keywords" content="address parsing API, address normalization, libpostal, free API, address validation, international addresses, postal address parser, REST API, no authentication" />
        <meta name="application-name" content="LibPostal API" />
        <meta name="msapplication-TileColor" content="#0969da" />
        
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

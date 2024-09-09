import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";
import { ContextProvider } from "~/contexts/Context";
import React from "react";
export async function loader() {
  return json({
    ENV: {
      API_KEY: process.env.API_KEY,
      API_URL: process.env.API_URL,
    },
  });
}
const Setup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <ContextProvider>
          <Setup>{children}</Setup>
        </ContextProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

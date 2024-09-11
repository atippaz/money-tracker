import { createCookie } from "@remix-run/node";

export const session = createCookie("auth", {
  maxAge: 604_800, // one week,
});

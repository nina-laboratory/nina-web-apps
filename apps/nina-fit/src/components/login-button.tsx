"use client";

import { Button } from "@nina/ui-components";
import { signIn } from "next-auth/react";

export function LoginButton() {
  return <Button onClick={() => signIn("google")}>Sign In with Google</Button>;
}

"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = {};

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAdmin,
    initialState,
  );

  return (
    <form className="admin-login-form" action={formAction}>
      <label htmlFor="admin-password">Password</label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter admin password"
        required
      />
      {state.error ? (
        <p className="admin-login-form__error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Access Admin"}
      </button>
    </form>
  );
}

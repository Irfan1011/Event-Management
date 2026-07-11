import { redirect, type ActionFunctionArgs } from "react-router";

import AuthForm from "@components/AuthForm";

function AuthenticationPage() {
  return (
    <>
      <AuthForm />
    </>
  );
}

export default AuthenticationPage;

export const authAction = async ({ request }: ActionFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode");
  const data = await request.formData();

  if (mode !== "signup" && mode !== "login") {
    throw new Response("Mode is not exist", { status: 422 });
  }

  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const response = await fetch(`${import.meta.env.VITE_REST_API_URL}` + mode, {
    method: "POST",
    body: JSON.stringify(authData),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (response.status === 422 || response.status === 401) return response;

  if (!response.ok) {
    throw new Response("Authentication Failed", { status: 500 });
  }

  return redirect("/");
};

export const logoutAction = async () => {
  const response = await fetch(`${import.meta.env.VITE_REST_API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Response("Logout Failed", { status: 500 });
  }

  return redirect("/");
};

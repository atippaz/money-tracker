import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import _auth from "~/utils/auth";
import { json, redirect, useActionData, useNavigate } from "@remix-run/react";
import {
  ActionFunction,
  createCookie,
  createSession,
  TypedResponse,
} from "@remix-run/node";
import { ResponseAction } from "~/interfaces/loader";
import { session } from "~/utils/cookie";

export const action: ActionFunction = async ({
  request,
}): Promise<TypedResponse<ResponseAction<string>>> => {
  const auth = _auth();

  const formData = await request.formData();
  const credential = formData.get("credential");
  const password = formData.get("password");

  if (typeof credential !== "string" || typeof password !== "string") {
    return json<ResponseAction<string>>({
      data: "Invalid form data",
      status: 400,
    });
  }

  try {
    const result = await auth.login(credential, password);
    if (!result) throw new Error("");
    // redirect("/");

    return json<ResponseAction<string>>(
      {
        data: result,
        status: 200,
      },
      {
        headers: {
          "Set-Cookie": await session.serialize(result),
        },
      }
    );
  } catch (ex) {
    return json<ResponseAction<string>>({
      data: "Invalid form data",
      status: 400,
    });
  }
};
const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const actionData = useActionData<ResponseAction<string>>();

  useEffect(() => {
    if (!actionData) return;
    if (actionData?.status == 400) {
      alert("รหัสผ่านผิด");
      return;
    }
    localStorage.setItem("auth", actionData!.data);
    navigate("/");
  }, [actionData]);

  const navigate = useNavigate();
  async function register() {
    navigate("/register");
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form className="space-y-4" method="post">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Or Username
            </label>
            <Input
              name="credential"
              placeholder="you@example.com"
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              name="password"
              type="password"
              placeholder="********"
              className="mt-1 block w-full"
            />
          </div>
          <Button
            // onClick={(e) => {
            //   e.preventDefault();
            //   login();
            // }}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Sign In
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              register();
            }}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

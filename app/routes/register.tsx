import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import _auth from "~/utils/auth";

// ฟังก์ชันตรวจสอบข้อมูลเบื้องต้น
const validateFormData = (formData: FormData) => {
  const errors: Record<string, string> = {};

  if (
    !formData.get("userName") ||
    (formData.get("userName") as string).length < 3
  ) {
    errors.userName = "Username must be at least 3 characters long";
  }

  if (
    !formData.get("email") ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get("email") as string)
  ) {
    errors.email = "Please enter a valid email address";
  }

  if (!formData.get("firstName")) {
    errors.firstName = "First name is required";
  }

  if (!formData.get("lastName")) {
    errors.lastName = "Last name is required";
  }

  if (
    !formData.get("password") ||
    (formData.get("password") as string).length < 6
  ) {
    errors.password = "Password must be at least 6 characters long";
  }

  return errors;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const errors = validateFormData(formData);
  const auth = _auth();

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  // เรียก API ที่ backend (เช่น Go)
  const response = await auth.register({
    userName: formData.get("userName")?.toString()!,
    email: formData.get("email")?.toString()!,
    firstName: formData.get("firstName")?.toString()!,
    lastName: formData.get("lastName")?.toString()!,
    password: formData.get("password")?.toString()!,
  });
  console.log(response);
  if (!response) {
    return json(
      { errors: { message: "Registration failed" } },
      { status: 500 }
    );
  }

  return redirect("/login");
};

const RegisterPage = () => {
  const actionData = useActionData(); // ใช้เพื่อรับข้อมูล error จาก server
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        <Form method="post" className="space-y-4">
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <Input
              name="userName"
              placeholder="Username"
              className="mt-1 block w-full"
            />
            {actionData?.errors?.userName && (
              <p className="text-red-500 text-sm">
                {actionData.errors.userName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              name="email"
              placeholder="you@example.com"
              className="mt-1 block w-full"
            />
            {actionData?.errors?.email && (
              <p className="text-red-500 text-sm">{actionData.errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <Input
              name="firstName"
              placeholder="First Name"
              className="mt-1 block w-full"
            />
            {actionData?.errors?.firstName && (
              <p className="text-red-500 text-sm">
                {actionData.errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <Input
              name="lastName"
              placeholder="Last Name"
              className="mt-1 block w-full"
            />
            {actionData?.errors?.lastName && (
              <p className="text-red-500 text-sm">
                {actionData.errors.lastName}
              </p>
            )}
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
            {actionData?.errors?.password && (
              <p className="text-red-500 text-sm">
                {actionData.errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            // disabled={transition.state === "submitting"}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            submit
            {/* {transition.state === "submitting" ? "Registering..." : "Register"} */}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";

import { Form, Link, redirect, useNavigation, useSearchParams,useActionData } from "@remix-run/react";
import { getSupabaseClient } from "~/utils/getSupabaseClient";
import Button from "~/components/Button";
import TextField from "~/components/TextField";
import { commitSession, getSession } from "~/session.server";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Sign Up | Remix Dashboard",
    },
  ];
};

export async function action({request}: ActionFunctionArgs){
  const formData = await request.formData();
  const email = formData.get("email")
  const name = formData.get("name")
  const password = formData.get("password")

  if(typeof email != "string" || typeof name !="string" || typeof password != "string"){
    return Response.json({ error:"All fields are required."}, {status:400})
  }  

  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.auth.signUp(
    {
      email: email,
      password: password,
      options: {
        data: {
          first_name: name,
        }
      }
    }
  )
  if(error){
    console.log("There was an error with Supabase Signup", error);

    if (error.code === 'user_already_exists') {
      return Response.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    return Response.json({error: error.message},{status:400})
  }

  const session = await getSession(request.headers.get("Cookie"));

  if (data?.session?.access_token){
    session.set("__session", data.session.access_token);

    return redirect("/dashboard",{
      headers: {
        "Set-Cookie": await commitSession(session),
      }
    });
  }else {
    // Handle the case where data.session or access_token is missing
    console.warn("Signup successful, but session data is missing:", data);
    return Response.json({ success: true, user: data.user, message: "Signup successful, but unable to log in automatically." });
    // You might choose to redirect to a different page or show a message to the user.
  }
  
}



export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("__session");

  if (token) {
    return redirect("/dashboard");
  }

  return Response.json({});
}





export default function SignUp() {
  const navigation = useNavigation();
  const actionData = useActionData<{ error?: string }>()
  const [searchParams] = useSearchParams();

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="w-full max-w-2xl px-8 py-10 space-y-8 bg-white shadow-md rounded-xl lg:space-y-10 lg:px-10 lg:py-12 ">
       {actionData?.error && (
        <p className="p-3 mb-4 text-sm rounded-md bg-rose-50 text-rose-700">
          {actionData.error} {/* Display the error message */}
        </p>
      )}
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-4xl">
          Sign Up for Remix Dashboard
        </h1>
        <p className="text-sm">
          Already have an account?{" "}
          <Link
            className="underline text-cyan-600"
            to={{
              pathname: "/login",
              search: searchParams.toString(),
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
      <Form method="POST">
        <fieldset
          className="w-full space-y-4 lg:space-y-6 disabled:opacity-70"
          disabled={isSubmitting}
        >
          <TextField
            id="email"
            name="email"
            label="Email address"
            required
            type="email"
            placeholder="Email address"
          />
          <TextField
            id="name"
            name="name"
            label="Name"
            required
            type="text"
            placeholder="Name Surname"
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            required
            type="password"
            placeholder="password"
          />
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Login
          </Button>
        </fieldset>
      </Form>
    </div>
  );
}

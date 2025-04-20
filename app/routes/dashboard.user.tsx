import type { MetaFunction,LoaderFunctionArgs } from "@remix-run/node";

import {useLoaderData } from "@remix-run/react";
import { UserProfile, ErrorResponse } from "../types";  // Adjust import paths accordingly

import { getUserDetails } from "../utils/getUserDetails";

export const meta: MetaFunction = () => {
  return [
    {
      title: "User | Remix Dashboard",
    },
  ];
};
export async function loader({ request }: LoaderFunctionArgs) {
  
  return getUserDetails(request);

 
}


export default function User() {
  const data = useLoaderData() as UserProfile | ErrorResponse;  // Type assertion

  // Check if it's an error response
  if ("error" in data) {
    return <div>Error: {data.error}</div>;
  }

  // TypeScript now knows `data` is a UserProfile
  const { first_name, last_name, email,numbers} = data;

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900 lg:text-3xl">
        User Details
      </h1>
      <div className="flex flex-col overflow-hidden bg-white shadow-md rounded-xl md:flex-row">
        <div className="flex flex-col w-full px-8 py-10 bg-slate-50 md:basis-1/3 md:items-center lg:py-12">
          <img
            className="object-cover w-20 h-20 rounded-full ring-2 ring-cyan-300 lg:w-28 lg:h-28"
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(`${first_name} ${last_name}`)}&background=random`}
            alt="first and last name"
          />
        </div>
        <div className="px-8 py-10 md:basis-2/3 lg:px-10 lg:py-12">
          <div className="mb-6 space-y-1">
            <p className="text-sm">Name</p>
            <p className="font-medium">{first_name} {last_name}</p>
          </div>
          <div className="mb-6 space-y-1 overflow-hidden">
            <p className="text-sm">Email</p>
            <p className="font-medium truncate">{email}</p>
          </div>
          <div className="mb-6 space-y-1">
            <p className="text-sm">Phone Number</p>
            <p className="font-medium">{numbers}</p>
          </div>
        </div>
      </div>
    </>
  );
}


//import type {LoaderFunctionArgs } from "@remix-run/node";
import { getSession } from "../session.server";
import { getSupabaseClient } from "../utils/getSupabaseClient";
import { UserProfile, ErrorResponse } from "../types";  // Adjust import paths accordingly
//import { redirect } from "@remix-run/node";

export async function getUserDetails(request: Request): Promise<UserProfile | ErrorResponse> {
    try {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("__session");

    if (!token) {
      return { error: "User not logged in" };
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error("Supabase Auth Error:", authError);
      throw new Error("Invalid session")
    }

    if (!user?.id) {
      console.error("User ID is missing after authentication.");
      return { error: "User ID not found" };
    }

    console.log("Authenticated User ID:", user.id);

    const { data: userData, error: dbError } = await supabase
      .from("profiles")
      .select("id,first_name,last_name,email,numbers")
      .eq("id", user.id)
      .single();

    if (dbError) {
      console.error("DB Error fetching profile:", dbError);
      return { error: "Failed to fetch user profile" };
    }

    console.log("Fetched User Profile:", userData);
    return userData;

  } catch (error) {
    console.error("Session or Supabase error:", error);
    return { error: "An unexpected error occurred"};
  }
}
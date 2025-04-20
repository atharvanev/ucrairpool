import { useUser } from "../root"; // adjust path if needed
import { useNavigate } from "@remix-run/react";
import { getSupabaseClient } from "../utils/getSupabaseClient";


export default function UserProfile() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    navigate("/"); // redirect after logout
  };

  if (!user) return <p className="text-red-500">Not logged in</p>;

  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-md mx-auto mt-10 space-y-2">
      <h2 className="text-xl font-semibold">👋 Welcome, {user["Display Name"]}!</h2>
      <p className="text-sm text-gray-600">Email: {user.email}</p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

import { Form, Link } from "@remix-run/react";
import { useRef, useState } from "react";

import type { UserProfile } from "../types";

type Props = {
  user: UserProfile;
};

import Popup from "./Popup";

export default function ProfilePopup({ user }: Props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center cursor-pointer"
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        ref={popupButtonRef}
      >
        <img
          className="w-12 h-12 rounded-full ring-2 ring-cyan-300"
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.first_name} ${user.last_name}`)}&background=random`}
          alt="avatar"
        />
      </button>
      {isPopupOpen && (
        <Popup
          isOpen={isPopupOpen}
          setIsOpen={setIsPopupOpen}
          buttonRef={popupButtonRef}
          className="right-0 p-4 mt-2 bg-white rounded-md shadow-sm top-full"
        >
          <div className="px-2 py-2 text-sm">
            <p className="font-semibold">{user.first_name} {user.last_name}</p>
            <p>{user.email}</p>
          </div>
          <div className="py-2 space-y-1">
            <Link
              to="/dashboard/user"
              className="flex items-center px-4 py-2 text-sm transition rounded-md text-slate-700 hover:bg-slate-100"
            >
              Profile
            </Link>
            <Form action="/logout" method="POST">
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm text-left transition rounded-md text-slate-700 hover:text-white hover:bg-cyan-500/90"
              >
                Logout
              </button>
            </Form>
          </div>
        </Popup>
      )}
    </div>
  );
}

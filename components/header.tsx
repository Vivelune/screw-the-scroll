"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";

export default function Header() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <header className="flex justify-end items-center p-4 gap-4 border-b">
      {isSignedIn ? (
        <UserButton />
      ) : (
        <>
          <Link
            href="/sign-in"
            className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition"
          >
            Sign Up
          </Link>
        </>
      )}
    </header>
  );
}
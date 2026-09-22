"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn } = useAuth();

  return (
    <header className="flex justify-end items-center p-4 gap-4 border-b">
      {isSignedIn ? (
        <UserButton />
      ) : (
        <SignInButton />
      )}
    </header>
  );
}
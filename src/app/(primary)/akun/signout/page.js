'use client';

import { useClerk } from "@clerk/nextjs";

export default function SignOutPage() {
    const { signOut } = useClerk();

    signOut();

    return null;
}
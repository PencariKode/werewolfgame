"use client";

import { useRef } from "react";
import { UserProfile } from "@clerk/nextjs";

import SNK from "@/app/(primary)/akun/component/snk";
import { SnkIcon } from "@/app/(primary)/akun/component/snk";

const DotIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
    >
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );
};

const SignOutIcon = () => (<i className="fa-sharp fa-solid fa-arrow-left-from-bracket"></i>)

const UserProfilePage = () => (
  <div className="min-w-full max-w-full min-h-fit h-screen sm:h-[120vh] flex justify-center pt-16">
    <UserProfile path="/akun" routing="path">
      <UserProfile.Page
        label="S&K"
        labelIcon={<SnkIcon />}
        url="snk"
        routing="path"
      >
        <SNK />
      </UserProfile.Page>
      <UserProfile.Link label="Log Out" labelIcon={<SignOutIcon />} url="/akun/signout"></UserProfile.Link>
    </UserProfile>
  </div>
);

export default UserProfilePage;

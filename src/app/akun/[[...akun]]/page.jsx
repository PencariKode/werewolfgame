"use client";

import { UserProfile } from "@clerk/nextjs";

import SNK from "@/app/akun/component/snk";
import { SnkIcon } from "@/app/akun/component/snk";

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
    </UserProfile>
  </div>
);

export default UserProfilePage;

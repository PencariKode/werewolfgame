import { SignedIn, SignedOut } from "@clerk/nextjs";
import RoomForm from "./roomform";

export default async function Page() {


    return (
        <>
            <SignedIn>
                <div className="mincomp bg-dark-text/0 mt-10 xs:px-16 sm:px-28 md:px-40 lg:px-80 xl:px-96 2xl:px-[30rem] flex flex-col gap-5">
                    <h1 className="font-bold text-2xl mincomp text-center">Buat Room Private</h1>
                    <fieldset className="mincomp px-3 py-5 border-[1.5px] mb-20 border-none rounded-md">
                        <RoomForm />
                    </fieldset>
                </div>


            </SignedIn>
            <SignedOut>

                <div className="mincomp bg-dark-text/0 mt-10 xs:px-16 sm:px-28 md:px-40 lg:px-80 xl:px-96 2xl:px-[30rem] flex flex-col gap-5">
                    <h1 className="font-bold text-2xl mincomp text-center">Buat Room Private</h1>
                    <p className="mincomp text-center">Anda harus login terlebih dahulu untuk membuat room private.</p>
                </div>
            </SignedOut>
        </>
    );
}
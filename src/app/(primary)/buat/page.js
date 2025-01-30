import { SignedIn, SignedOut } from "@clerk/nextjs";


export default async function Page() {


    return (
        <>
            <SignedIn>
                <div className="mincomp bg-dark-text/0 mt-10">
                    <h1 className="font-bold text-2xl mincomp text-center">Buat Room Private</h1>
                    <div className="mincomp">
                        
                    </div>
                </div>


            </SignedIn>
        </>
    );
}
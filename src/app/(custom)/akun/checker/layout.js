import { Suspense } from "react";

export default function RootLayout({ children }) {
    return (
        <main className="mincomp h-screen flex justify-center items-center">
            <Suspense>
                {children}
            </Suspense>
        </main>
    );
}
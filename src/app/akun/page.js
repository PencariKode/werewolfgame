import { redirect } from 'next/navigation';
// import { currentUser, auth } from '@clerk/nextjs/server';
import * as clerk from '@clerk/nextjs/server';

export default async function AkunPage() {
    // redirect('/akun/signin');

    console.log(await clerk.auth());

    return (
        <div>
            <h1>Akun Page</h1>
        </div>
    );
}
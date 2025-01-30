'use client';

import { SignUp } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation';

 function Page() {
    const searchParams = useSearchParams();

    let url = '/akun/checker';
    if (searchParams.has('redirect_url')) {
        url += '?redirect_url=' + searchParams.get('redirect_url');
    }

    return (
        <div className='min-w-full max-w-full min-h-screen flex justify-center items-center'>
            <SignUp forceRedirectUrl={url} />
        </div>
    );
}

export default Page;
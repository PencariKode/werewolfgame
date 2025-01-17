import { SignIn } from '@clerk/nextjs'

async function Page() {
    
    return (
        <div className='min-w-full max-w-full min-h-screen flex justify-center items-center'>
            <SignIn />
        </div>
    );
}

export default Page;
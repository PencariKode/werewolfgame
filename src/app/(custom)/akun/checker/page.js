'use client'

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import Link from 'next/link';


export default function Page() {
    const apikey = process.env.NEXT_PUBLIC_WEB_APIKEY;

    const router = useRouter();
    const searchParams = useSearchParams();

    const [userApiRes, setUserApiRes] = useState({});
    const [clerkApiRes, setClerkApiRes] = useState({});
    const [isUserExist, setIsUserExist] = useState(null);
    const timer = useRef([]);
    const dirLink = useRef(null)

    const clerk = useClerk();

    let url = '/';

    if (searchParams.has('redirect_url')) {
        url = searchParams.get('redirect_url');
    }

    useEffect(() => {
        async function fetchUsers() {
            const response = await fetch('/api/acc/users?apikey=' + apikey);
            const result = await response.json();


            if (!result.success) {
                console.log("FETCH USER", result.error);
                Swal.fire("Error: EAC101", `Terjadi kesalahan pada server <br>Silahkan Log-in ulang!`, "error");
                clerk.signOut();
                return;
            }

            setUserApiRes(result);

        }

        async function fetchClerk() {
            const response = await fetch('/api/acc/clerk?apikey=' + apikey);
            const result = await response.json();

            if (!result.success) {
                console.log(result.error);
                Swal.fire("Error: EAC102", `Terjadi kesalahan pada server <br>Silahkan Log-in ulang!`, "error");
                clerk.signOut();
                return;
            }

            setClerkApiRes(result);
        }

        timer.current.push(setTimeout(() => {
            dirLink.current.classList.remove('invisible');
        }, 4500))

        fetchUsers();
        fetchClerk();

    }, []);

    useEffect(() => {
        if (userApiRes.success && clerkApiRes.success) {
            if (userApiRes.data && clerkApiRes.data) {
                if (userApiRes.data.length < 0 || clerkApiRes.data.length < 0) {
                    console.log('User or Clerk not found');
                    Swal.fire("Error: EAC103", `User or Clerk not found <br>Silahkan Log-in ulang!`, "error");
                    return;
                }
                const userFind = userApiRes.data.find(user => user.clerkId === clerkApiRes.data.id);

                if (!userFind)
                    setIsUserExist(false);
                else
                    setIsUserExist(true);
            }
        }
    }, [userApiRes, clerkApiRes]);

    useEffect(() => {
        if (isUserExist === null) return;
        console.log("IS USER EXIST", isUserExist)

        if (isUserExist === true) {
            console.log("USER EXIST")

            let newData = {
                name: clerkApiRes.data.firstName + ' ' + clerkApiRes.data.lastName,
                clerkId: clerkApiRes.data.id,
                email: clerkApiRes.data.emailAddresses[0].emailAddress,
                imageUrl: clerkApiRes.data.imageUrl,
                role: clerkApiRes.data.publicMetadata?.role ? Object.keys(clerkApiRes.data.publicMetadata.role).length > 0 ? clerkApiRes.data.publicMetadata.role : 'user' : 'user'
            }

            let oldData = userApiRes.data.find(user => user.clerkId === clerkApiRes.data.id);

            
            if (isUserDataModified(oldData, newData)) {
                console.log("USER DATA MODIFIED")
                let body = JSON.stringify({id: clerkApiRes.data.id, data: newData});

                try {
                    fetch('/api/acc/users', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': apikey
                        }, 
                        body
                    })
                    .then(res => res.json().then(r => console.log(r)))
                } catch (err) {
                    console.log(err);
                    Swal.fire("Error: EAC104", `Terjadi kesalahan pada server <br>Silahkan Log-in ulang!`, "error");
                    clerk.signOut();
                    return;
                }
            }
            timer.current.forEach((x) => clearTimeout(x));
            router.push(url);
        }

        if (isUserExist === false) {

            let role = clerkApiRes.data.publicMetadata?.role ? Object.keys(clerkApiRes.data.publicMetadata.role).length > 0 ? clerkApiRes.data.publicMetadata.role : 'user' : 'user'
            let body = JSON.stringify({
                name: clerkApiRes.data.firstName + ' ' + clerkApiRes.data.lastName,
                clerkId: clerkApiRes.data.id,
                email: clerkApiRes.data.emailAddresses[0].emailAddress,
                imageUrl: clerkApiRes.data.imageUrl,
                role
            })

            try {
                fetch('/api/acc/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apikey
                    },
                    body
                })
                    .then(res => res.json().then(r => console.log(r)))

            } catch (err) {
                console.log(err);
                Swal.fire("Error: EAC105", `Terjadi kesalahan pada server <br>Silahkan Log-in ulang!`, "error");
                clerk.signOut();
                return;
            }

        }


    }, [isUserExist]);

    useEffect(() => {
        timer.current.push(setTimeout(() => {
            console.log("TIME OUT")
            router.push(url);
        }, 5000));

        return () => clearTimeout(timer.current);
    }, []);


    return (
        <div className='mincomp text-center flex flex-col justify-center items-center mt-10 font-semibold text-xl gap-5'>
            <p className='mincomp text-center'>Redirecting in 5 seconds...</p>
            <i ref={dirLink} className='mincomp invisible text-sm italic font-thin'><Link className='underline text-blue-700' href={url}>Click here</Link> if you are not redirected automatically</i>
        </div>
    );
}

function isUserDataModified(oldData, newData) {
    if ('_id' in oldData) delete oldData._id;
    if ('createdAt' in oldData) delete oldData.createdAt;
    if ('updatedAt' in oldData) delete oldData.updatedAt;
    if ('__v' in oldData) delete oldData.__v;

    let oldKeys = Object.keys(oldData);
    let newKeys = Object.keys(newData);

    if (oldKeys.length !== newKeys.length) return true;

    for (let i = 0; i < oldKeys.length; i++) {
        if (!newKeys.includes(oldKeys[i])) return true;
        if (oldData[oldKeys[i]] !== newData[oldKeys[i]]) return true;
    }
}

Page.wow = true;
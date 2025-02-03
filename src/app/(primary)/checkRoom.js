'use client';

import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCheckRoom } from '../utils';



export default function CheckRoom() {
    const { userId } = useAuth(); // Add clerk auth hook
    const path = usePathname();
    let isAllowed = false;
    const allowedPath = [ '/buat', '/lobby', '/tutorial']
    allowedPath.forEach((p) => {
        if (path.startsWith(p)) {
            isAllowed = true;
            return;
        }
    })

    const { isJoined, setIsJoined, roomCode, setRoomCode, reset } = useCheckRoom();
    const router = useRouter();
    
    useEffect(() => {
        // console.log('USE AUTH', userId)
        // Only redirect if user is signed in
        if (userId && isJoined && (roomCode !== "")) {
            if (isAllowed) return;
            Swal.fire(`Gagal`, `Anda sudah bergabung di room ${roomCode}`, 'info');
            router.push(`/lobby/${roomCode}`);
        }
    });

    return (<></>)
}

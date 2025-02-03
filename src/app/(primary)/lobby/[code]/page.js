"use client";

import { useEffect, useTransition, useState, useRef, useActionState, startTransition } from "react"; 
import { useRouter, usePathname } from "next/navigation";
import { getRoom, deleteRoom } from "./actions";
import { useCheckRoom } from "@/app/utils";

export default function Page() {
    const apikey = process.env.NEXT_PUBLIC_WEB_APIKEY;
    const [stateDel, delRoom, isDelPending] = useActionState(deleteRoom);

    const router = useRouter();
    const path = usePathname();
    let code = ((path.split('/')).at(-1)).toUpperCase();
    const cekRoom = useCheckRoom()
    

    const [isUserPending, startUserTransition] = useTransition();
    const [isRoomPending, startRoomTransition] = useTransition();

    const [room, setRoom] = useState(undefined);
    const [user, setUser] = useState(undefined);

    const urlRef = useRef(undefined)
    const codeRef = useRef();
    const linkRef = useRef();

    useEffect(() => {
        if (!stateDel) return;
        if (stateDel.success) {
            cekRoom.reset()
            Swal.fire('Berhasil', 'Room berhasil dihapus', 'success')
            .then(() => router.replace('/'));
        } else {
            Swal.fire('Gagal', 'Room gagal dihapus', 'error');
        }
    }, [stateDel]);

    useEffect(() => {
        urlRef.current = window.location.href

        async function getUser() {
            const response = await fetch(`/api/acc/clerk?apikey=${apikey}`);
            if (response.status === 401 || response.statusText === 'Unauthorized') {
                setUser(null)
                Swal.fire('Gagal', 'Silahkan login terlebih dahulu', 'error')
                .then(() => router.replace('/akun/signin'));
                return;
            }
            if (!response.ok) throw new Error('Network response was not ok');

            const userData = await response.json();
            if (!userData.success) throw new Error('API response was not successful');

            setUser(userData.data);
        }

        startUserTransition(() => {
            getUser();
        });


        startRoomTransition(async () => {
            const rum = await getRoom(code.toLowerCase());
            setRoom(!rum.success ? null :  rum.data);
        });
    }, []);

    useEffect(() => {
        if (user === null ) {
            cekRoom.reset()
            Swal.fire('Gagal', 'Silahkan Sign In Terlebih dahulu', 'error')
            .then(() => router.replace('/akun/signin'));
            return
        }
        if (room === null) {
            cekRoom.reset()
            Swal.fire('Gagal', 'Room tidak ditemukan', 'error')
            .then(() => router.replace('/'));
            return
        }
        
        if (room && user && !(room.lobbyJoined.includes(user?.id))) {
            
            // console.log('ROOM', room);
            if (cekRoom.roomCode === code) cekRoom.reset()
            Swal.fire('Gagal', 'Anda belum bergabung di room', 'error')
            .then(() => router.replace('/'));
        }
    }, [room, user])

    // useEffect(() => {
    //     console.log('PENDING', isUserPending);
    // }, [isUserPending]);
    // useEffect(() => {
    //     console.log('PENDING2', isRoomPending);
    // }, [isRoomPending]);

    function handleCopyCode() {
        codeRef.current.select();
        document.execCommand('copy');
    }
    function handleCopyLink() {
        linkRef.current.select();
        document.execCommand('copy');
        navigator?.clipboard?.readText();
        navigator?.clipboard?.writeText(linkRef.current.value);
    }

    return (
        <>
            {room !== null ? (
            <div className="mincomp mt-10">
                <section className="flex flex-col mincomp justify-center items-center">
                    <h1 className="text-4xl font-[800] uppercase tracking-wide bg-dark-primary text-dark-secondary px-8 pt-4 pb-3 rounded-xl">Lobby</h1>
                    <p className="mincomp mt-1 px-10 text-center">Harap menunggu sampai permainan dimulai oleh pemilik permainan: </p>
                    <b className="uppercase font-bold bg-gray-800 px-2 py-0.5 rounded-md">{(isRoomPending ? "Loading...": room?.owner?.nama) || 'ERROR'}</b>
                </section>
                <section className="mincomp flex flex-col mt-10 px-8">
                    <fieldset className="mincomp flex flex-col justify-center items-center border rounded-md px-4 py-3 gap-3">
                        <legend className="float-left font-semibold bg-gray-700 px-3 py-1 rounded-md">Kode Room</legend>
                        <input ref={codeRef} value={isRoomPending ? 'Loading...' : code.slice(0,3) + "-" + code.slice(3)} readOnly className="w-[50%] text-center rounded-md h-10 text-xl font-bold text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:border-yellow-700 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
                        <input ref={linkRef} defaultValue={urlRef.current} readOnly className="w-[50%] text-center rounded-md h-10 text-xl !hidden font-bold text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:border-yellow-700 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
                        <div className="mincomp flex items-center justify-around px-5">
                            <button onClick={handleCopyCode} type="button" className="!min-w-24 !max-w-24 h-8 rounded-md text-base font-bold bg-dark-accent border-2 border-transparent hover:border-yellow-800 active:border-yellow-700 active:scale-[1] hover:scale-[1.02]">{isRoomPending ? "Loading":"Salin Kode"}</button>
                            <button onClick={handleCopyLink} type="button" className="!min-w-24 !max-w-24 h-8 rounded-md text-base font-bold bg-blue-900 border-2 border-transparent hover:border-yellow-800 active:border-yellow-700 active:scale-[1] hover:scale-[1.02]">{isRoomPending?"Loading":"Salin Link"}</button>
                        </div>
                    </fieldset>
                </section>
                <section className="mincomp flex flex-col mt-10 px-8">
                    <fieldset className="mincomp flex flex-col justify-center items-center border rounded-md px-4 py-3 gap-3">
                        <legend className="float-left font-semibold bg-gray-700 px-3 py-1 rounded-md">Pemain</legend>
                        <div className="mincomp flex px-2">
                            <div className="w-[80%] flex flex-col">
                                <p className="font-medium truncate text-blue-100 ">Pemain Join: </p>
                                <p className="font-medium truncate text-red-100">Pemain dibutuhkan: </p>
                            </div>
                            <div className="w-[20%] flex flex-col text-right pr-3">
                                <p className="font-bold truncate text-blue-100 ">{isRoomPending ? 'Loading...' : room?.lobbyJoined?.length}</p>
                                <p className="font-bold truncate text-red-100">{isRoomPending ? 'Loading...' : room?.jumlahPemain}</p>
                            </div>
                        </div>
                    </fieldset>
                </section>
                <section className="mincomp flex flex-col mt-10 px-8 justify-center items-center">
                    {room?.owner?.clerkId === user?.id ? (
                        <button onClick={() => {
                            startTransition(() => delRoom(code.toLowerCase()));
                        }} type="button" disabled={isDelPending} className="!min-w-40 !max-w-40 h-8 rounded-md text-base font-bold bg-red-800 border-2 border-transparent hover:border-yellow-800 active:border-yellow-700 active:scale-[1] hover:scale-[1.02] disabled:opacity-60 disabled:cursor-progress">Hapus Room</button>
                    ) : (
                        <button type="button" className="!min-w-40 !max-w-40 h-8 rounded-md text-base font-bold bg-red-800 border-2 border-transparent hover:border-yellow-800 active:border-yellow-700 active:scale-[1] hover:scale-[1.02]">Keluar dari Room</button>
                    )}
                </section>
            </div>
            ) : (
                <div className="mincomp h-screen flex justify-center items-center">
                    <h1 className="text-3xl font-medium tracking-wide px-8 py-4 rounded-xl">Loading...</h1>
                </div>
            )}
        </>
    )
}
"use client";

import { useEffect, useTransition, useState, useRef, useActionState, startTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getRoom, deleteRoom, leaveRoom as lvRoom } from "./actions";
import { useCheckRoom } from "@/app/utils";

export default function Page() {
    const apikey = process.env.NEXT_PUBLIC_WEB_APIKEY;
    const [stateDel, delRoom, isDelPending] = useActionState(deleteRoom);
    const [stateLeave, leaveRoom, isLeavePending] = useActionState(lvRoom)

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

    const [players, setPlayers] = useState([])


    useEffect(() => {
        const eventSource = new EventSource('/api/sse/lobby?roomCode=' + code.toLowerCase());

        eventSource.onmessage = (event) => {
            try {
                // console.log("EVDATA", event.data)
                const eventData = JSON.parse(event.data);
                console.log("eventData", eventData)

                if (eventData.type) {

                    switch (eventData.type) {
                        case 'init':
                            setPlayers(eventData.players)
                            break;

                        case 'join':
                            if (players.find((player) => player.id === eventData.message.id)) break;
                            setPlayers((prev) => [...prev, { fullname: eventData.message.fullname, id: eventData.message.id }])
                            break;
                        case 'leave':
                            setPlayers((prev) => prev.filter((player) => player.id !== eventData.message.id))
                            break;
                        case 'delete':
                            if (!user) return alert("Room telah dihapus, silahkan reload halaman ini!");
                            let idOwner = players?.find(z => z.owner === true);
                            if (idOwner?.id !== user.id) {
                                Swal.fire({
                                    title: "Room dihapus...",
                                    text: "Rooom telah dihapus oleh pemilik room",
                                    icon: "info"
                                }).then(() => router.push('/'))
                            }
                            break;

                        default:
                            // Swal.fire("Error", 'Terjadi kesalahan saat memuat User, reload halaman ini!', 'warning')
                            break;
                    }
                }

            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        return () => {
            eventSource.close();
        };
    }, []);


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
        console.log('LEAVE', stateLeave);
        if (!stateLeave) return;
        if (stateLeave.success) {
            cekRoom.reset()
            Swal.fire('Berhasil', 'Anda berhasil keluar dari room', 'success')
                .then(() => router.replace('/'));
        } else {
            Swal.fire('Gagal', 'Anda gagal keluar dari room', 'error');
        }
    }, [stateLeave]);

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
            setRoom(!rum.success ? null : rum.data);
        });
    }, []);

    useEffect(() => {
        if (user === null) {
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
            return
        }

        // if (user && user.id && !(players.includes(user.id))) setPlayers((pre) => {
        //     return [...pre, {fullname: (user.fullname || (user.firstName + ' ' + user.lastName)) ,id: user.id}]
        // })
    }, [room, user])

    useEffect(() => {
        console.log("PLAYERSS", players)
    }, [players])
    // useEffect(() => {
    //     console.log('PENDING', isUserPending);
    // }, [isUserPending]);
    // useEffect(() => {
    //     console.log('PENDING2', isRoomPending);
    // }, [isRoomPending]);

    useEffect(() => {
        if (isLeavePending || isDelPending) {
            Swal.fire({
                title: 'Keluar dari room...',
                text: 'harap menunggu',
                icon: 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })
        }
    }, [isLeavePending, isDelPending])

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
                <div className="mincomp mt-10 mb-20 xs:px-10 sm:px-20 md:px-40 lg:px-72 xl:px-96 2xl:px-[30rem]">
                    <section className="flex flex-col mincomp justify-center items-center">
                        <h1 className="text-4xl font-[800] uppercase tracking-wide bg-dark-primary text-dark-secondary px-8 pt-4 pb-3 rounded-xl">Lobby</h1>
                        <p className="mincomp mt-1 px-10 text-center">Harap menunggu sampai permainan dimulai oleh pemilik permainan: </p>
                        <b className="uppercase font-bold bg-gray-800 px-2 py-0.5 rounded-md">{(isRoomPending ? "Loading..." : room?.owner?.nama) || 'ERROR'}</b>
                    </section>
                    <section className="mincomp flex flex-col mt-10 px-8">
                        <fieldset className="mincomp flex flex-col justify-center items-center border rounded-md px-4 py-3 gap-3">
                            <legend className="float-left font-semibold bg-gray-700 px-3 py-1 rounded-md">Kode Room</legend>
                            <input ref={codeRef} value={isRoomPending ? 'Loading...' : code.slice(0, 3) + "-" + code.slice(3)} readOnly className="w-[50%] text-center rounded-md h-10 text-xl font-bold text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:border-yellow-700 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
                            <input ref={linkRef} defaultValue={urlRef.current} readOnly className="w-[50%] text-center rounded-md h-10 text-xl !hidden font-bold text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:border-yellow-700 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
                            <div className="mincomp flex items-center justify-around px-5">
                                <button onClick={handleCopyCode} type="button" className="!min-w-24 !max-w-24 h-8 rounded-md text-base font-bold bg-dark-accent border-2 border-transparent hover:border-yellow-800 active:border-yellow-700 active:scale-[1] hover:scale-[1.02]">{isRoomPending ? "Loading" : "Salin Kode"}</button>
                                <button onClick={handleCopyLink} type="button" className="!min-w-24 !max-w-24 h-8 rounded-md text-base font-bold bg-blue-900 border-2 border-transparent hover:border-yellow-800 active:border-yellow-700 active:scale-[1] hover:scale-[1.02]">{isRoomPending ? "Loading" : "Salin Link"}</button>
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
                                    <p className="font-bold truncate text-blue-100 ">{(isRoomPending ? 'Loading...' : players.length) || room?.lobbyJoined?.length}</p>
                                    <p className="font-bold truncate text-red-100">{isRoomPending ? 'Loading...' : room?.jumlahPemain}</p>
                                </div>
                            </div>
                        </fieldset>
                    </section>
                    <section className="mincomp flex flex-col justify-center items-center mt-10 px-8">
                        <fieldset className="min-h-2 w-fit flex flex-col justify-center items-center border rounded-md px-4 py-3 gap-3">
                            <legend className="float-left font-semibold bg-gray-700 px-3 py-1 rounded-md">List Pemain</legend>
                            <ul className=" min-h-2 min-w-[50%] flex px-2 list-decimal flex-col marker:font-bold">
                                {players.map((player, index) => (
                                    <li key={index} className="capitalize ">{player.fullname}</li>
                                ))}
                            </ul>
                        </fieldset>
                    </section>
                    <section className="mincomp flex flex-col mt-10 px-8 justify-center items-center">
                        {room?.owner?.clerkId === user?.id ? (
                            <button onClick={() => {
                                Swal.fire({
                                    title: 'Hapus Room?',
                                    text: 'Apakah anda yakin ingin menghapus room ini?',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    confirmButtonText: 'Ya, Hapus',
                                    cancelButtonText: 'Batal',
                                    confirmButtonColor: '#8c0e03',
                                    cancelButtonColor: '#1e3a8a',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        startTransition(() => delRoom(code.toLowerCase()));
                                    }
                                });
                            }} type="button" disabled={isDelPending} className="!min-w-40 !max-w-40 h-8 rounded-md text-base font-bold bg-red-800 border-2 border-transparent hover:border-yellow-800 active:border-yellow-700 active:scale-[1] hover:scale-[1.02] disabled:opacity-60 disabled:cursor-progress">Hapus Room</button>
                        ) : (
                            <button onClick={() => {
                                Swal.fire({
                                    title: 'Keluar dari Room?',
                                    text: 'Apakah anda yakin ingin keluar dari room ini?',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    confirmButtonText: 'Ya, Keluar',
                                    cancelButtonText: 'Batal',
                                    confirmButtonColor: '#8c0e03',
                                    cancelButtonColor: '#1e3a8a',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        startTransition(() => leaveRoom({ roomCode: code.toLowerCase(), user: user?.id, fullname: (user?.fullname || (user?.firstName + ' ' + user?.lastName)) }));
                                    }
                                });
                            }} type="button" disabled={isLeavePending} className="!min-w-40 !max-w-40 h-8 rounded-md text-base font-bold bg-red-800 border-2 border-transparent hover:border-yellow-800 active:border-yellow-700 active:scale-[1] hover:scale-[1.02]">Keluar dari Room</button>
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
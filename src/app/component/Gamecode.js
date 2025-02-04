'use client';

import Link from "next/link";
import { frijole } from "@/app/ui/fonts";
import { useState, useEffect, useActionState, startTransition, useTransition } from "react";
import { joinRoom } from "./joinActions";
import { useCheckRoom } from "@/app/utils";
import { useRouter } from "next/navigation";

export default function Gamecode() {
    const apikey = process.env.NEXT_PUBLIC_WEB_APIKEY;
    const [value, setValue] = useState('');
    const [isBtnDisabled, setBtnDisabled] = useState(true);

    const router = useRouter();

    const cekRoom = useCheckRoom();

    const [stateJoin, joinAction, isJoinPending] = useActionState(joinRoom, null);
    const [isUserPending, startUserTransition] = useTransition();
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        async function getUser() {
            const response = await fetch(`/api/acc/clerk?apikey=${apikey}`);
            if (response.status === 401 || response.statusText === 'Unauthorized') {
                setUser(null)
                // Swal.fire('Gagal', 'Silahkan login terlebih dahulu', 'error')
                // .then(() => router.replace('/akun/signin'));
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
    }, []);

    useEffect(() => {
        if (user === null) {
            // Swal.fire('Gagal', 'Silahkan login terlebih dahulu', 'error')
            // .then(() => router.replace('/akun/signin'));
        }
    }, [user]);


    function isAbleToJoinYet() {
        if (isJoinPending || isUserPending) return true;
        if (user === null) return true;
        return false;
    }

    useEffect(() => {
        setBtnDisabled(() => isAbleToJoinYet());
    }, [isJoinPending, isUserPending, value, user]);
    // useEffect(() => {
    //     console.log("USEEEEEER", user);
    // }, [user]);


    function validateRoom(e) {
        if (value.length === 0) {
            Swal.fire("Really bro?", 'Isi dulu lah!!', 'error');
            e.preventDefault()
            return
        }

        if (value.length !== 7) {
            Swal.fire("Format Salah!", 'contoh: (A1B-CD3)', 'error');
            e.preventDefault()
            return
        }

        const regex = /^[0-9a-f]{3}-[0-9a-f]{3}$/i;
        if (!regex.test(value) || !value.includes('-')) {
            Swal.fire("Format Salah!", 'contoh: (A1B-CD3)', 'error');
            e.preventDefault()
            return
        }

        if (user === null) {
            e.preventDefault();
            Swal.fire('Gagal', 'Silahkan login terlebih dahulu', 'error')
            .then(() => router.push('/akun/signin'));
            return;
        }
        if (user === undefined) {
            e.preventDefault();
            Swal.fire('Gagal', 'Mohon reload halaman ini!', 'error');
            return;
        }
        
        if (isBtnDisabled) {
            e.preventDefault();
            return
        }

        startTransition(() => {
            e.preventDefault();
            // console.log("USERNYAAAAA", user.id, user);
            joinAction({roomCode: value, user: user.id});
        });
        e.preventDefault();
    }

    function handleChange(e) {
        let newValue = e.target.value.toUpperCase();
        if (newValue.length === 6 && !newValue.includes('-')) {
            newValue = newValue.slice(0, 3) + '-' + newValue.slice(3);
        }
        if (newValue.length > 7) {
            newValue = newValue.slice(0, 7);
        }
        if (newValue.length === 3 && !newValue.includes('-')) {
            newValue += '-';
        }
        setValue(() =>newValue);
    }
    function handleKey(e) {
        let listKey = "0123456789abcdef".split('');
        listKey.push(...["backspace", "enter", 'tab']);
        if (e.key === 'Backspace' && value.length === 4) {
            e.preventDefault();
            setValue(v => v.slice(0, 3));
        }
        if (!listKey.includes(e.key.toLowerCase())) {
            e.preventDefault();
        }
    }

    useEffect(() => {
        if (stateJoin === null) return;
        if (!stateJoin.success) {
            Swal.fire('Gagal', stateJoin.error, 'error');
            return;
        }

        cekRoom.setIsJoined(true);
        cekRoom.setRoomCode(value.replace('-', '').toLowerCase());
        cekRoom.setNewJoin(true);

        // console.log("ROOM CODE", cekRoom);
        // Swal.fire('Berhasil', 'Anda berhasil bergabung', 'success')
        // .then(() => router.replace(`/lobby/${value.replace('-', '').toLowerCase()}`));

    }, [stateJoin]);

    return (
        <section className="mincomp px-8 mt-10 pb-10 xs:px-20 md:px-40 lg:px-64 xl:px-96">
            <form tabIndex={1} className="mincomp" onSubmit={validateRoom}>
                <fieldset className="mincomp flex flex-col gap-2 py-3 px-5 border-solid border border-dark-text rounded-md">
                    <legend className="float-left text-2xl font-bold text-yellow-400 mincomp flexcenter">Join Room</legend>
                    <div className="mincomp flexcenter">
                        <input
                            type="text"
                            id="codegame"
                            name="codegame"
                            className=" focus:border-slate-400 border-2 border-transparent min-w-2 w-full min-h-2 flex justify-center items-center px-3 text-center h-10 text-2xl text-dark-text bg-gray-500 placeholder:text-dark-text placeholder:text-opacity-80 placeholder:text-xl placeholder:[text-transform:capitalize;] rounded-md uppercase outline-none"
                            placeholder="Masukkan Kode..."
                            value={value}
                            tabIndex={1}
                            onChange={handleChange}
                            onKeyDown={handleKey}
                        />
                    </div>
                    <div className="mincomp flexcenter gap-2 transition-all *:transition-all *:w-full *:h-8">
                        <button type="submit"  title={isBtnDisabled ? "Silahkan Sign-In terlebih dahulu!" : ''} tabIndex={2} autoComplete="nope" className={`bg-teal-700 disabled:!opacity-80 disabled:!cursor-not-allowed ${(value.length !== 7) ? 'cursor-progress' : 'cursor-pointer'} px-3 text-lg font-semibold rounded-[0.25rem] border border-transparent hover:bg-teal-500 hover:border-teal-950 hover:text-white`}>Masuk</button>
                        <button type="button" tabIndex={3} onClick={() => setValue('')} className="bg-dark-accent px-3 text-lg font-semibold rounded-[0.25rem] border-2 border-transparent hover:bg-red-700 hover:border-dark-accent hover:text-white">Hapus</button>
                    </div>
                </fieldset>
            </form>
            <div className="mincomp flexcenter flex-col gap-2 mt-2 px-6">
                <span className="mincomp text-lg font-bold text-center text-dark-text">Atau</span>
                <Link href="/buat" className=" bg-yellow-400 text-dark-primary flexcenter text-xl !font-bold rounded-md h-10 w-full min-w-full max-w-full min-h-2 hover:font-semibold hover:bg-opacity-90">Buat Room</Link>
            </div>
        </section>
    );
}
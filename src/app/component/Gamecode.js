'use client';

import Link from "next/link";
import { frijole } from "@/app/ui/fonts";
import { useState, useEffect } from "react";


export default function Gamecode() {
    const [value, setValue] = useState('');

    function validateRoom(e) {
        const regex = /^[0-9a-f]{3}-[0-9a-f]{3}$/i;
        if (!regex.test(value) || !value.includes('-')) {
            Swal.fire("Format Salah!", '(A1B-CD3)', 'error');
            e.preventDefault()
        }
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

    return (
        <section className="mincomp px-8 mt-10 pb-10 xs:px-20 md:px-40 lg:px-64 xl:px-96">
            <form tabIndex={1} className="mincomp" action="/join" onSubmit={validateRoom}>
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
                        <button type="submit" tabIndex={2} className="bg-teal-700 px-3 text-lg font-semibold rounded-[0.25rem] border border-transparent hover:bg-teal-500 hover:border-teal-950 hover:text-white">Masuk</button>
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
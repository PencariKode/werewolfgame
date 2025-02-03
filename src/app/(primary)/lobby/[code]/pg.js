// 'use client'

// import { useRef, useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { useCheckRoom } from "@/app/utils";


// export default function Page() {
//     const router = useRouter();

//     useEffect(() => {
//         let croom = (localStorage.getItem('checkRoom'));
//         if (croom) croom = JSON.parse(croom).state;
//         if (!croom || !croom.isJoined) {
//             Swal.fire('Gagal', 'Anda belum bergabung di room', 'error');
//             router.replace('/');
//         }

//     }, []);
//     const apikey = process.env.NEXT_PUBLIC_WEB_APIKEY;

//     const path = usePathname()
//     let code = (path.split('/')).at(-1)

//     const [user, setUser] = useState(null)
//     const [room, setRoom] = useState(null)


//     const [isLoading, setIsLoading] = useState(false);
//     const [isLoading2, setIsLoading2] = useState(false);
//     const [isLoad, setIsLoad] = useState(true);

//     useEffect(() => {
//         async function getUser() {
//             if (user || isLoading) return;

//             setIsLoading(true);
//             try {
//                 const response = await fetch(`/api/acc/clerk?apikey=${apikey}`);
//                 if (response.status === 401 || response.statusText === 'Unauthorized') {
//                     Swal.fire('Gagal', 'Silahkan login terlebih dahulu', 'error')
//                     .then(() => router.replace('/akun/signin'));
//                     return;
//                 }
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                     // return;
//                 }

//                 const userData = await response.json();
//                 if (!userData.success) throw new Error('API response was not successful');
//                 setUser(userData.data);
//             } catch (err) {
//                 console.warn(err);
//                 Swal.fire('Gagal', 'Terjadi kesalahan saat mengambil data user', 'error');
//                 // return
//             } finally {
//                 setIsLoading(false);
//             }
//         }

//         getUser();
//     }, [apikey, user]);


//     useEffect(() => {
//         async function getRoom() {
//             if (room || isLoading2) return;

//             setIsLoading2(true);
//             try {
//                 const response = await fetch(`/api/room?apikey=${apikey}&code=${code}`);
//                 if (!response.ok) throw new Error('Network response was not ok');

//                 const roomData = await response.json();
//                 if (!roomData.success) throw new Error('API response was not successful');
//                 setRoom(roomData.data);
//             } catch (err) {
//                 console.error(err);
//                 Swal.fire('Gagal', 'Terjadi kesalahan saat mengambil data room', 'error');
//             } finally {
//                 setIsLoading2(false);
//         }
//     }
//     getRoom();
//     }, [apikey, room, isLoading2]);


//     useEffect(() => {
//         if (isLoading || isLoading2) {
//             setIsLoad(true);
//         }
//         if (!isLoading && !isLoading2) {
//             setIsLoad(false);
//         }
//     }, [isLoading, isLoading2]);


//     useEffect(() => {
//         if (!user || isLoading) return;

//         console.log("USER", user);
//     }, [user, isLoading]);
//     useEffect(() => {
//         if (!room || isLoading2) return;

//         console.log("ROOM", room);
//     }, [room, isLoading2]);

//     // useEffect(() => console.log(isLoad), [isLoad]);

//     function getPermission() {
//         return navigator.permissions.query({ name: 'clipboard-write' })
//             .then(result => {
//                 if (result.state === 'granted' || result.state === 'prompt') {
//                     return true;
//                 }
//                 throw new Error('Clipboard permission denied');
//             })
//             .catch(err => {
//                 console.error('Clipboard permission error:', err);
//                 return false;
//             });
//     }

//     function salinKode() {
//         getPermission();
//         navigator.clipboard.writeText(code.slice(0,3) + "-" + code.slice(3));
//         Swal.fire('Berhasil', 'Kode room berhasil disalin', 'success');
//     }
//     function salinLink() {
//         navigator.clipboard.writeText(window.location);
//         Swal.fire('Berhasil', 'Link room berhasil disalin', 'success');
//     }
//     return (
//         <>
//             <div className="mincomp mt-10">
//                 <section className="flex flex-col mincomp justify-center items-center">
//                     <h1 className="text-4xl font-[800] uppercase tracking-wide bg-dark-primary text-dark-secondary px-8 py-4 rounded-xl">Lobby</h1>
//                     <p className="mincomp mt-1 px-10 text-center">Harap menunggu sampai permainan dimulai oleh pemilik permainan: </p>
//                     <b className="uppercase font-bold bg-gray-800 px-2 py-0.5 rounded-md">Panjay Bro</b>
//                 </section>
//                 <section className="mincomp flex flex-col mt-10 px-8">
//                     <fieldset className="mincomp flex flex-col justify-center items-center border rounded-md px-4 py-3 gap-3">
//                         <legend className="float-left font-semibold bg-gray-700 px-3 py-1 rounded-md">Kode Room</legend>
//                         <input defaultValue={isLoad ? 'Loading...' : code.slice(0,3) + "-" + code.slice(3)} readOnly className="w-[50%] text-center rounded-md h-10 text-xl font-bold text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:border-yellow-700 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
//                         <div className="mincomp flex items-center justify-around px-5">
//                             <button onClick={salinKode} type="button" className="!min-w-24 !max-w-24 h-8 rounded-md text-base font-bold bg-dark-accent border-2 border-transparent hover:border-yellow-800 active:border-yellow-700 active:scale-[1] hover:scale-[1.02]">{isLoad ? "Loading":"Salin Kode"}</button>
//                             <button onClick={salinLink} type="button" className="!min-w-24 !max-w-24 h-8 rounded-md text-base font-bold bg-blue-900 border-2 border-transparent hover:border-yellow-800 active:border-yellow-700 active:scale-[1] hover:scale-[1.02]">{isLoad?"Loading":"Salin Link"}</button>
//                         </div>
//                     </fieldset>
//                 </section>
//                 <section className="mincomp flex flex-col mt-10 px-8">
//                     <fieldset className="mincomp flex flex-col justify-center items-center border rounded-md px-4 py-3 gap-3">
//                         <legend className="float-left font-semibold bg-gray-700 px-3 py-1 rounded-md">Pemain</legend>
//                         <div className="mincomp flex px-2">
//                             <div className="w-[80%] flex flex-col">
//                                 <p className="font-medium truncate text-blue-100 ">Pemain Join: </p>
//                                 <p className="font-medium truncate text-red-100">Pemain dibutuhkan: </p>
//                             </div>
//                             <div className="w-[20%] flex flex-col text-right pr-3">
//                                 <p className="font-bold truncate text-blue-100 ">{isLoad ? 'Loading...' : room?.lobbyJoined?.length}</p>
//                                 <p className="font-bold truncate text-red-100">{isLoad ? 'Loading...' : room?.jumlahPemain}</p>
//                             </div>
//                         </div>
//                     </fieldset>
//                 </section>
//                 <section className="mincomp flex flex-col mt-10 px-8 justify-center items-center">
//                     <button type="button" className="!min-w-40 !max-w-40 h-8 rounded-md text-base font-bold bg-red-800 border-2 border-transparent hover:border-yellow-800 active:border-yellow-700 active:scale-[1] hover:scale-[1.02]">Keluar dari Room</button>
//                 </section>
//             </div>
//         </>
//     );
// }
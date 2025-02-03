'use client';

import { useEffect, useActionState } from "react";
import { useGameConfigStore, useCheckRoom } from "@/app/utils";
import RoleBalance from "@l/roleConfig";
import ProgressBar from "@/app/component/Progress";
import randomNama from "./randomNama";
import { addRoom } from "./actions";
import { useRouter } from "next/navigation";

export default function RoomForm() {
    const [stt, action, isPending] = useActionState(addRoom, null);
    const gameroom = useCheckRoom()
    
    useEffect(()=>{

        if (gameroom.isJoined && (gameroom.roomCode !== "")) {
            router.push(`/lobby/${gameroom.roomCode}`);
        }
    })

    const gameState = useGameConfigStore();
    const router = useRouter()

    const {
        roleCombi, setRoleCombi,
        gameTitle, setGameTitle,
        playerCount, setPlayerCount,
        roleConfig, setRoleConfig,
        setRoleCount,
        reset
    } = gameState;

    const gmConf = new RoleBalance(playerCount);

    const rawConf = gmConf.getRoleConfiguration();

    /** List Of Handling Function */
    const handle = {

        mulaiGame: function handleMulaiGame() {
            console.log("Mulai Game");
        },

        /** Role Combination handler
         * @param {Event} e
         */
        roleCombi: function handleRoleCombi(e) {
            if (e.target.id === "combiRoleDefault") {
                setRoleCombi("default");
                Object.keys(roleConfig).forEach((key) => {
                    setRoleCount(key, rawConf.recom[key]);
                });
            }
            else if (e.target.id === "combiRoleCustom")
                setRoleCombi("custom");
            else {
                Swal.fire("ERROR", "Silahkan reload page ini!", "error");
                setRoleCombi("default");
            }
        },

        /**
         * Game Title handler
         * @param {Event} e 
         */
        gameTitle: function handleGameTitle(e) {
            setGameTitle(e.target.value);
        },
        randomTitle: function handleRandomTitle() {
            setGameTitle(randomNama());
        },

        /**
         * Player Count handler
         * @param {Event} e 
         */
        playerCount: function handlePlayerCount(e) {
            let value = e.target.value;
            if (value == '') return setPlayerCount('');

            value = parseInt(value);

            if (value == 0) return setPlayerCount(0);
            if (value >= 50) return setPlayerCount(50);
            if (isNaN(value)) {
                Swal.fire("Error", "Jumlah pemain harus berupa angka!", "error");
                setPlayerCount(0);
            }
            setPlayerCount(e.target.value);
        },
        addPlayerCount: function handleAddPlayerCount() {
            if (playerCount == '') return setPlayerCount(1);
            if (playerCount < 7) return setPlayerCount(7);
            if (playerCount >= 50) return setPlayerCount(50);
            setPlayerCount(parseInt(playerCount) + 1);
        },
        subPlayerCount: function handleSubPlayerCount() {
            if (playerCount == '') return setPlayerCount(0);
            if (playerCount <= 7) return setPlayerCount(7);
            setPlayerCount(parseInt(playerCount) - 1);
        },


        isRoleOver: function handleIsRoleOver(c) {
            let ret = Object.values(roleConfig).reduce((a, b) => a + b) + c;
            // return ret >= playerCount;
            if (c === 0 && ret >= playerCount) {
                return setPlayerCount(parseInt(playerCount) + 1);
            } else if (c === -1 && ret <= playerCount) {
                if (playerCount <= 7) return setPlayerCount(7);
                return setPlayerCount(parseInt(playerCount) - 1);
            }
        },
        addRole: function handleAddRole(str, e) {
            // if (this.isRoleOver(0)) return;
            if (roleConfig[str] >= rawConf.max[str]) return;
            this.isRoleOver(0);
            if (roleConfig[str] >= 50) return;
            setRoleCount(str, roleConfig[str] + 1);
        },
        subRole: function handleSubRole(str, e) {
            // if (this.isRoleOver(-1)) return;
            if (roleConfig[str] <= rawConf.min[str]) return;
            this.isRoleOver(-1);
            if (roleConfig[str] <= 0) return;
            setRoleCount(str, roleConfig[str] - 1);
        },



        configReset: function handleConfigReset() {
            reset();
        },

        isRoleDef: function handleIsRoleDef() {
            return roleCombi === "default";
        },


        role: {
            setWarga: function handleRoleWarga(e) {
                let value = e.target.value === '' ? '' : parseInt(e.target.value);
                // console.log(value, value >= rawConf.max.warga)
                if (value >= rawConf.max.warga) return setRoleCount("warga", rawConf.max.warga);
                // value = isNaN(value) ? 0 : parseInt(value);
                setRoleCount("warga", value);
            },
            setWerewolf: function handleRoleWerewolf(e) {
                let value = e.target.value === '' ? '' : parseInt(e.target.value);
                if (value >= rawConf.max.werewolf) return setRoleCount("werewolf", rawConf.max.werewolf);
                // value = isNaN(value) ? 0 : parseInt(value);
                setRoleCount("werewolf", value);
            },
            setPeramal: function handleRolePeramal(e) {
                let value = e.target.value === '' ? '' : parseInt(e.target.value);
                if (value >= rawConf.max.peramal) return setRoleCount("peramal", rawConf.max.peramal);
                // value = isNaN(value) ? 0 : parseInt(value);
                setRoleCount("peramal", value);
            },
            setPenyihir: function handleRolePenyihir(e) {
                let value = e.target.value === '' ? '' : parseInt(e.target.value);
                if (value >= rawConf.max.penyihir) return setRoleCount("penyihir", rawConf.max.penyihir);
                // value = isNaN(value) ? 0 : parseInt(value);
                setRoleCount("penyihir", value);
            },
            setPemburu: function handleRolePemburu(e) {
                let value = e.target.value === '' ? '' : parseInt(e.target.value);
                if (value >= rawConf.max.pemburu) return setRoleCount("pemburu", rawConf.max.pemburu);
                // value = isNaN(value) ? 0 : parseInt(value);
                setRoleCount("pemburu", value);
            },
            setDukun: function handleRoleDukun(e) {
                let value = e.target.value === '' ? '' : parseInt(e.target.value);
                if (value >= rawConf.max.dukun) return setRoleCount("dukun", rawConf.max.dukun);
                // value = isNaN(value) ? 0 : parseInt(value);
                setRoleCount("dukun", value);
            },
            setRaja: function handleRoleRaja(e) {
                let value = e.target.value === '' ? '' : parseInt(e.target.value);
                if (value >= rawConf.max.raja) return setRoleCount("raja", rawConf.max.raja);
                // value = isNaN(value) ? 0 : parseInt(value);
                setRoleCount("raja", value);
            },
            setBlackwolf: function handleRoleBlackwolf(e) {
                let value = e.target.value === '' ? '' : parseInt(e.target.value);
                if (value >= rawConf.max.blackwolf) return setRoleCount("blackwolf", rawConf.max.blackwolf);
                // value = isNaN(value) ? 0 : parseInt(value);
                setRoleCount("blackwolf", value);
            },
            setShapeshifter: function handleRoleShapeshifter(e) {
                let value = e.target.value === '' ? '' : parseInt(e.target.value);
                if (value >= rawConf.max.shapeshifter) return setRoleCount("shapeshifter", rawConf.max.shapeshifter);
                // value = isNaN(value) ? 0 : parseInt(value);
                setRoleCount("shapeshifter", value);
            },

        },
    }


    useEffect(() => {
        Object.keys(roleConfig).forEach((key) => {
            if (rawConf.recom[key] < 0) return setRoleCount(key, rawConf.min[key]);
            setRoleCount(key, rawConf.recom[key]);
        });
    }, [playerCount])


    useEffect(() => {
        if (isPending) {
            Swal.fire({
                title: 'Membuat room...',
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
        } else {
            if (stt && !stt.success) {
                Swal.close();
                Swal.fire({
                    title: 'Error',
                    text: stt?.error,
                    icon: "error"
                })
            } else {
                Swal.close();
                if (stt) {

                    gameroom.setRoomCode(stt.room.roomCode);
                    gameroom.setIsJoined(true);

                    router.push(`/lobby/${stt.room.roomCode}`);
                }
            }
        }
    }, [isPending])


    return (
        <>
            <legend style={{
                color: isPending ? "red" : "white"
            }} className="float-left mincomp flex items-center justify-center text-center font-medium">Buat room kamu sendiri</legend>
            <form className="mincomp" action={action}>
                <div className="mincomp flex flex-col mt-10 gap-5">

                    <section className="mincomp flex flex-col px-2 pt-2 pb-3 rounded-md gap-2 border border-gray-600">
                        <label htmlFor="judulGame" className="mincomp text-base text-center">Judul Room</label>
                        <input id="judulGame" onChange={handle.gameTitle} value={gameTitle} type="text" name="judulgame" placeholder="Judul game..." required className="mincomp rounded-md h-10 text-xl font-medium text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:border-yellow-700 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
                        <div className="mincomp flex justify-center items-center">
                            <button onClick={handle.randomTitle} type="button" className="!min-w-24 !max-w-24 h-8 rounded-md text-sm bg-gray-800 border-2 border-transparent hover:border-yellow-800 active:border-yellow-700 active:scale-[1] hover:scale-[1.02]">Random</button>
                        </div>
                    </section>

                    <section className="mincomp flex flex-col px-2 pt-2 pb-2 rounded-md gap-2 border border-gray-600">
                        <label htmlFor="jlhPemain" className="mincomp text-base text-center">Jumlah Pemain</label>
                        <input id="jlhPemain" onChange={handle.playerCount} value={playerCount} type="number" min={0} max={50} name="jlhPemain" placeholder="Jumlah pemain..." required className="mincomp rounded-md h-10 text-xl font-medium text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:border-yellow-700 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
                        <div className="mincomp flex justify-around">
                            <button onClick={handle.subPlayerCount} type="button" className="!min-w-16 !max-w-16 h-10 rounded-md text-base bg-gray-800 opacity-80 hover:opacity-100 border-2 border-transparent hover:border-yellow-800/50 active:border-yellow-800/100 active:scale-90 hover:scale-[.92]"><i className="fa-solid fa-minus"></i></button>
                            <button onClick={handle.addPlayerCount} type="button" className="!min-w-16 !max-w-16 h-10 rounded-md text-base bg-gray-800 opacity-80 hover:opacity-100 border-2 border-transparent hover:border-yellow-800/50 active:border-yellow-800/100 active:scale-90 hover:scale-[.92]"><i className="fa-solid fa-plus"></i></button>
                        </div>
                        <span className="text-yellow-400 opacity-75 text-[.65rem] text-justify mx-2">Note: <i className="text-yellow-500">Moderator / Gamemaster tidak termasuk hitungan pemain!</i></span>
                    </section>

                    <section className="mincomp flex flex-col px-2 pt-2 pb-2 rounded-md gap-2 border border-gray-600">
                        <label className="mincomp text-base text-center">Tipe Kombinasi Role:</label>
                        <div className="mincomp flex justify-between ">
                            <button type="button" onClick={handle.roleCombi} id="combiRoleDefault" className={`!min-w-[45%] !max-w-[45%] h-10 rounded-md text-base active:scale-[.97] ${roleCombi === "default" ? "combiRoleActive" : "combiRoleNonActive"}`}>Default</button>
                            <button type="button" onClick={handle.roleCombi} id="combiRoleCustom" className={`!min-w-[45%] !max-w-[45%] h-10 rounded-md text-base active:scale-[.97] ${roleCombi === "default" ? "combiRoleNonActive" : "combiRoleActive"}`}>Custom</button>
                            <input defaultValue={roleCombi} name="roleCombi" className="hidden"></input>
                        </div>
                        <span className="text-yellow-400 opacity-75 text-[.65rem] text-justify mx-2">Note: <i className="text-yellow-500">Role default adalah konfigurasi terbaik untuk bermain game <b>Werewolf</b>.</i></span>
                    </section>

                    <section className="mincomp flex flex-col px-2 pt-2 pb-3 rounded-md gap-2 border border-gray-600">
                        <label className="mincomp text-base text-center">Persentase Kekuatan</label>
                        <div className="mincomp flex justify-between items-center">
                            <b>M</b>
                            {/* <span className="hidden w-[87%] min-w-[87%] max-w-[87%]"></span> */}
                            <ProgressBar percentage={gmConf.getHumanPercentage(rawConf.max)} />
                            <b>W</b>
                        </div>
                    </section>

                    <section className="mincomp flex flex-col !px-2 pt-2 pb-3 rounded-md gap-2 border border-gray-600">
                        <label htmlFor="" className="mincomp text-base text-center">Konfigurasi Kombinasi Role:</label>
                        <div className="mincomp flex flex-col ml-2">
                            <span className="text-sm  font-thin">Role Utama:</span>

                            <div className="mincomp flex font-bold justify-between items-center mb-3">
                                <label htmlFor="rWarga" className="max-w-full w-[40%] ">• Warga: </label>
                                <div className="max-w-full w-[50%] flex mr-2 justify-between items-center group">
                                    <button onClick={(e) => handle.subRole("warga", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-minus"></i></button>
                                    <input name="rWarga" id="rWarga" onChange={handle.role.setWarga} value={roleConfig.warga} readOnly={handle.isRoleDef()} type="number" className="!max-w-[35%] read-only:cursor-not-allowed read-only:opacity-75 flex items-center justify-center text-center rounded-md h-10 text-xl font-medium text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:!border-yellow-700 group-hover:border-yellow-800 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
                                    <button onClick={(e) => handle.addRole("warga", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-plus"></i></button>
                                </div>
                            </div>

                            <div className="mincomp flex font-bold justify-between items-center mb-3">
                                <label htmlFor="rWerewolf" className="max-w-full w-[40%] ">• Werewolf: </label>
                                <div className="max-w-full w-[50%] flex mr-2 justify-between items-center group">
                                    <button onClick={(e) => handle.subRole("werewolf", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-minus"></i></button>
                                    <input name="rWerewolf" id="rWerewolf" onChange={handle.role.setWerewolf} value={roleConfig.werewolf} readOnly={handle.isRoleDef()} type="number" className="!max-w-[35%] read-only:cursor-not-allowed read-only:opacity-75 flex items-center justify-center text-center rounded-md h-10 text-xl font-medium text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:!border-yellow-700 group-hover:border-yellow-800 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
                                    <button onClick={(e) => handle.addRole("werewolf", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                        </div>
                        <div className="mincomp flex flex-col ml-2">
                            <span className="text-sm  font-thin">Role Pelengkap:</span>

                            <div className="mincomp flex font-bold justify-between items-center mb-3">
                                <label htmlFor="rPeramal" className="max-w-full w-[40%] ">• Peramal: <i className="text-xs text-blue-600">(M)</i></label>
                                <div className="max-w-full w-[50%] flex mr-2 justify-between items-center group">
                                    <button onClick={(e) => handle.subRole("peramal", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-minus"></i></button>
                                    <input name="rPeramal" id="rPeramal" onChange={handle.role.setPeramal} value={roleConfig.peramal} readOnly={handle.isRoleDef()} type="number" className="!max-w-[35%] read-only:cursor-not-allowed read-only:opacity-75 flex items-center justify-center text-center rounded-md h-10 text-xl font-medium text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:!border-yellow-700 group-hover:border-yellow-800 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
                                    <button onClick={(e) => handle.addRole("peramal", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-plus"></i></button>
                                </div>
                            </div>

                            <div className="mincomp flex font-bold justify-between items-center mb-3">
                                <label htmlFor="rPenyihir" className="max-w-full w-[40%] ">• Penyihir: <i className="text-xs text-blue-600">(M)</i></label>
                                <div className="max-w-full w-[50%] flex mr-2 justify-between items-center group">
                                    <button onClick={(e) => handle.subRole("penyihir", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-minus"></i></button>
                                    <input name="rPenyihir" id="rPenyihir" onChange={handle.role.setPenyihir} value={roleConfig.penyihir} readOnly={handle.isRoleDef()} type="number" className="!max-w-[35%] read-only:cursor-not-allowed read-only:opacity-75 flex items-center justify-center text-center rounded-md h-10 text-xl font-medium text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:!border-yellow-700 group-hover:border-yellow-800 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
                                    <button onClick={(e) => handle.addRole("penyihir", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-plus"></i></button>
                                </div>
                            </div>

                            <div className="mincomp flex font-bold justify-between items-center mb-3">
                                <label htmlFor="rPemburu" className="max-w-full w-[40%] ">• Pemburu: <i className="text-xs text-blue-600">(M)</i></label>
                                <div className="max-w-full w-[50%] flex mr-2 justify-between items-center group">
                                    <button onClick={(e) => handle.addRole("pemburu", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-minus"></i></button>
                                    <input name="rPemburu" id="rPemburu" onChange={handle.role.setPemburu} value={roleConfig.pemburu} readOnly={handle.isRoleDef()} type="number" className="!max-w-[35%] read-only:cursor-not-allowed read-only:opacity-75 flex items-center justify-center text-center rounded-md h-10 text-xl font-medium text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:!border-yellow-700 group-hover:border-yellow-800 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
                                    <button onClick={(e) => handle.addRole("pemburu", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-plus"></i></button>
                                </div>
                            </div>

                            <div className="mincomp flex font-bold justify-between items-center mb-3">
                                <label htmlFor="rDukun" className="max-w-full w-[40%] ">• Dukun: <i className="text-xs text-blue-600">(M)</i></label>
                                <div className="max-w-full w-[50%] flex mr-2 justify-between items-center group">
                                    <button onClick={(e) => handle.addRole("dukun", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-minus"></i></button>
                                    <input name="rDukun" id="rDukun" onChange={handle.role.setDukun} value={roleConfig.dukun} readOnly={handle.isRoleDef()} type="number" className="!max-w-[35%] read-only:cursor-not-allowed read-only:opacity-75 flex items-center justify-center text-center rounded-md h-10 text-xl font-medium text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:!border-yellow-700 group-hover:border-yellow-800 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
                                    <button onClick={(e) => handle.addRole("dukun", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-plus"></i></button>
                                </div>
                            </div>

                            <div className="mincomp flex font-bold justify-between items-center mb-3">
                                <label htmlFor="rRaja" className="max-w-full w-[40%] ">• Raja: <i className="text-xs text-blue-600">(M)</i></label>
                                <div className="max-w-full w-[50%] flex mr-2 justify-between items-center group">
                                    <button onClick={(e) => handle.addRole("raja", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-minus"></i></button>
                                    <input name="rRaja" id="rRaja" onChange={handle.role.setRaja} value={roleConfig.raja} readOnly={handle.isRoleDef()} type="number" className="!max-w-[35%] read-only:cursor-not-allowed read-only:opacity-75 flex items-center justify-center text-center rounded-md h-10 text-xl font-medium text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:!border-yellow-700 group-hover:border-yellow-800 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
                                    <button onClick={(e) => handle.addRole("raja", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-plus"></i></button>
                                </div>
                            </div>

                            <div className="mincomp flex font-bold justify-between items-center mb-3">
                                <label htmlFor="rBlackwolf" className="max-w-full w-[40%] ">• Blackwolf: <i className="text-xs text-red-600">(W)</i></label>
                                <div className="max-w-full w-[50%] flex mr-2 justify-between items-center group">
                                    <button onClick={(e) => handle.addRole("blackwolf", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-minus"></i></button>
                                    <input name="rBlackwolf" id="rBlackwolf" onChange={handle.role.setBlackwolf} value={roleConfig.blackwolf} readOnly={handle.isRoleDef()} type="number" className="!max-w-[35%] read-only:cursor-not-allowed read-only:opacity-75 flex items-center justify-center text-center rounded-md h-10 text-xl font-medium text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:!border-yellow-700 group-hover:border-yellow-800 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
                                    <button onClick={(e) => handle.addRole("blackwolf", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-plus"></i></button>
                                </div>
                            </div>

                            <div className="mincomp flex font-bold justify-between items-center mb-3">
                                <label htmlFor="rShapeshifter" className="max-w-full w-[40%] ">• Shapeshifter: <i className="text-xs text-red-600">(W)</i></label>
                                <div className="max-w-full w-[50%] flex mr-2 justify-between items-center group">
                                    <button onClick={(e) => handle.addRole("shapeshifter", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-minus"></i></button>
                                    <input name="rShapeshifter" id="rShapeshifter" onChange={handle.role.setShapeshifter} value={roleConfig.shapeshifter} readOnly={handle.isRoleDef()} type="number" className="!max-w-[35%] read-only:cursor-not-allowed read-only:opacity-75 flex items-center justify-center text-center rounded-md h-10 text-xl font-medium text-dark-text bg-gray-800 border-2 border-yellow-800/40 hover:!border-yellow-700 group-hover:border-yellow-800 placeholder-shown:border-transparent placeholder-shown:hover:border-yellow-700 focus:border-yellow-700 outline-none px-3 placeholder:font-normal placeholder:text-lg" />
                                    <button onClick={(e) => handle.addRole("shapeshifter", e)} disabled={handle.isRoleDef()} type="button" className="!min-w-[20%] !max-w-[20%] h-7 disabled:hover:scale-100 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[.96] active:scale-[.93] rounded-md text-base bg-gray-800"><i className="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                        </div>
                        <span className={`text-yellow-400 opacity-75 text-[.65rem] text-justify mx-2 ${roleCombi === "default" ? "hidden" : "block"}`}>Note: <i className="text-yellow-500">Tombol tidak dapat ditekan lagi jika role sudah mencapai batas</i></span>
                    </section>

                    <section className="mincomp flex flex-col px-2 pt-2 pb-3 rounded-md gap-2 border border-gray-600">
                        <label className="mincomp text-base text-center">Aksi</label>
                        <div className="mincomp flex items-center justify-around">
                            <button onClick={handle.configReset} type="button" className="!min-w-24 !max-w-24 h-10 rounded-md text-base font-bold bg-dark-accent border-2 border-transparent hover:border-yellow-800 active:border-yellow-700 active:scale-[1] hover:scale-[1.02]">Reset</button>
                            <button type="submit" disabled={isPending} className="!min-w-36 !max-w-40min-w-36 h-10 rounded-md text-base bg-blue-900 border-2 border-transparent hover:border-yellow-800 active:border-yellow-700 active:scale-[1] hover:scale-[1.02] disabled:opacity-70 disabled:cursor-wait">Buat Room</button>
                        </div>
                    </section>
                </div>
            </form>
        </>
    );
}
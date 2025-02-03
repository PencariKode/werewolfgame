'use server';

import crypto from 'crypto'
import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '@l/mgdb';
import Room from '@l/models/Room';
// import { redirect } from 'next/navigation';
// import { revalidatePath } from 'next/cache';

/*
{
  '$ACTION_REF_1': '',
  '$ACTION_1:0': '{"id":"609336aea824aee7b90fe42702852ae943e5e9e579","bound":"$@1"}',
  '$ACTION_1:1': '[null]',
  '$ACTION_KEY': 'k2818743687',
  judulgame: 'J.A. Dimara',
  jlhPemain: '7',
  roleCombi: 'default',
  rWarga: '4',
  rWerewolf: '1',
  rPeramal: '1',
  rPenyihir: '1',
  rPemburu: '0',
  rDukun: '0',
  rRaja: '0',
  rBlackwolf: '0',
  rShapeshifter: '0'
}
*/
const sleep = ms => new Promise(r => setTimeout(r, ms));
/**
 * 
 * @param {*} _ 
 * @param {FormData} formData 
 */
export async function addRoom(_, formData) {
    let roomCode;
    try {

        await dbConnect();
        const clerkUser = await currentUser();

        let roomId = await getRoomId();
        roomCode = await getRoomCode();

        const data = {
            judul: formData.get('judulgame'),
            roomId,
            roomCode,
            time: {
                create: Date.now(),
                start: -1
            },
            owner: {
                clerkId: clerkUser.id,
                nama: clerkUser.fullName || clerkUser.firstName + ' ' + clerkUser.lastName,
            },
            lobby: true,
            lobbyJoined: [clerkUser.id],
            isStarted: false,
            isEnded: false,
            jumlahPemain: formData.get('jlhPemain'),
            roleCombination: formData.get('roleCombi'),
            roleConfiguration: {
                warga: formData.get('rWarga'),
                werewolf: formData.get('rWerewolf'),
                peramal: formData.get('rPeramal'),
                penyihir: formData.get('rPenyihir'),
                pemburu: formData.get('rPemburu'),
                dukun: formData.get('rDukun'),
                raja: formData.get('rRaja'),
                blackwolf: formData.get('rBlackwolf'),
                shapeshifter: formData.get('rShapeshifter'),
            }
        }

        const room = new Room(data);
        await room.save();

        
        return { success: true, room: data};
    } catch (error) {
        console.log("ROOMERR", error);
        return {success: false, error}
    }
    // revalidatePath('/buat')
    // redirect('/lobby/'+roomCode)

}

export async function checkId(param) {
    try {
        // await dbConnect();
        const room = await Room.findOne({ roomId: param });
        if (room) return true;
    } catch (error) {
        console.log("ROOMERR", error);
    }
    return false;
}
export async function getRoomId(retries = 5) {
    const id = crypto.randomBytes(10).toString('hex');
    if (await checkId(id)) {
        if (retries > 0) {
            return await getRoomId(retries - 1);
        } else {
            throw new Error('Failed to generate unique room ID');
        }
    }
    return id;
}

export async function checkCode(param) {
    try {
        // await dbConnect();
        const room = await Room.findOne({ roomCode: param });
        if (room) return true;
    } catch (error) {
        console.log("ROOMERR", error);
    }
    return false;
}
export async function getRoomCode(retries = 5) {
    const code = crypto.randomBytes(3).toString('hex');
    if (await checkCode(code)) {
        if (retries > 0) {
            return await getRoomCode(retries - 1);
        } else {
            throw new Error('Failed to generate unique room code');
        }
    }
    return code;
}
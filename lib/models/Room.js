import mongoose from "mongoose";

const gameRoomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    roomCode: {
        type: String,
        required: true,
        unique: true
    },
    time: {
        create: {
            type: Number,
            required: true
        },
        start: {
            type: Number,
            required: true
        },
        
    },
    owner: {
        clerkId: {
            type: String,
            required: true
        },
        nama: {
            type: String,
            required: true
        }
    },
    lobby: {
        type: Boolean,
        required: true
    },
    lobbyJoined: {
        type: [String],
        required: true
    },
    isStarted: {
        type: Boolean,
        required: true
    },
    isEnded: {
        type: Boolean,
        required: true
    },
    judul: {
        type: String,
        required: true
    },
    jumlahPemain: {
        type: Number,
        required: true
    },
    roleCombination: {
        type: String,
        enum: ["default", "custom"],
        required: true
    },
    roleConfiguration: {
        warga: {
            type: Number,
            required: true
        },
        werewolf: {
            type: Number,
            required: true
        },
        peramal: {
            type: Number,
            required: true
        },
        penyihir: {
            type: Number,
            required: true
        },
        pemburu: Number,
        dukun: Number,
        raja: Number,
        blackwolf: Number,
        shapeshifter: Number
    }
})

export default mongoose.models.GameRoom || mongoose.model("GameRoom", gameRoomSchema);
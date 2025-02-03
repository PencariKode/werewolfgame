
/**
 * @typedef {Object} RoleConfig
 * @property {Number} warga - Jumlah warga
 * @property {Number} peramal - Jumlah peramal
 * @property {Number} penyihir - Jumlah penyihir
 * @property {Number} pemburu - Jumlah pemburu
 * @property {Number} dukun - Jumlah dukun
 * @property {Number} raja - Jumlah raja
 * @property {Number} werewolf - Jumlah werewolf
 * @property {Number} blackwolf - Jumlah blackwolf
 * @property {Number} shapeshifter - Jumlah shapeshifter
 * 
 * 
 * @typedef {Object} RawRoleConfig
 * @property {RoleConfig} min - Jumlah minimal masing-masing role
 * @property {RoleConfig} max - Jumlah maximal masing-masing role
 * @property {RoleConfig} recom - Saran jumlah masing-masing role
 * 
 * 
 * @typedef {Object} RoleAbilityLimit - Batas Penggunaan Kekuatan Role Spesial
 * @property {Number} penyihir
 * @property {Number} blackwolf
 * @property {Number} shapeshifter
 * @property {Number} peramal
 * @property {Number} pemburu
 * @property {Number} dukun
 * @property {Number} raja
 * 
 * 
 * @typedef {Object} RolePowerWeight
 * @property {Number} warga 
 * @property {Number} peramal 
 * @property {Number} penyihir 
 * @property {Number} pemburu
 * @property {Number} dukun 
 * @property {Number} raja 
 * @property {Number} werewolf 
 * @property {Number} blackwolf 
 * @property {Number} shapeshifter 
 */


/**
 * Kelas untuk mengatur keseimbangan permainan
 * @class GameBalance
 * @property {Number} playerCount - Jumlah pemain
 */
class RoleBalance {
    /**
     * @param {Number} playerCount - Jumlah pemain
     * @returns {RolePowerWeight}
     */
    constructor(playerCount) {
        this.playerCount = playerCount;
        // this.roleWeights = {
        //     warga: 1,
        //     peramal: 3,
        //     penyihir: 2,
        //     pemburu: 3,
        //     dukun: 2,
        //     raja: 4,
        //     werewolf: 2,
        //     blackwolf: 3,
        //     shapeshifter: 4
        // };

        this.humanRoleWeights = {
            warga: .4,
            peramal: 2,
            penyihir: 1.75,
            pemburu: 3,
            dukun: 2,
            raja: 4
        };
        
        this.werewolfRoleWeights = {
            werewolf: 3.25,
            blackwolf: 5.25,
            shapeshifter: 6
        };
    }

    /** Private method untuk menyesuaikan rekomendasi role
     * @param {RawRoleConfig} config - Konfigurasi role
     * @returns {RawRoleConfig}
     */
    _adjustRoleRecommendations(config) {
        const { recom, min, max } = config;
        let totalRecom = Object.values(recom).reduce((sum, count) => sum + count, 0);

        // Jika total rekomendasi kurang dari jumlah pemain
        while (totalRecom < this.playerCount) {
            // Prioritaskan menambah role manusia terlebih dahulu
            if (recom.warga < max.warga) {
                recom.warga += 1;
            } else if (recom.peramal < max.peramal) {
                recom.peramal += 1;
            } else if (recom.penyihir < max.penyihir) {
                recom.penyihir += 1;
            } else if (recom.dukun < max.dukun) {
                recom.dukun += 1;
            } else if (recom.raja < max.raja) {
                recom.raja += 1;
            } else {
                // Jika semua role manusia sudah maksimal, tambahkan werewolf
                if (recom.werewolf < max.werewolf) {
                    recom.werewolf += 1;
                } else if (recom.blackwolf < max.blackwolf) {
                    recom.blackwolf += 1;
                } else if (recom.shapeshifter < max.shapeshifter) {
                    recom.shapeshifter += 1;
                }
            }
            totalRecom += 1;
        }

        // Jika total rekomendasi lebih dari jumlah pemain
        while (totalRecom > this.playerCount) {
            // Prioritaskan mengurangi role werewolf terlebih dahulu
            if (recom.shapeshifter > min.shapeshifter) {
                recom.shapeshifter -= 1;
            } else if (recom.blackwolf > min.blackwolf) {
                recom.blackwolf -= 1;
            } else if (recom.werewolf > min.werewolf) {
                recom.werewolf -= 1;
            } else {
                // Jika semua role werewolf sudah minimal, kurangi role manusia
                if (recom.raja > min.raja) {
                    recom.raja -= 1;
                } else if (recom.dukun > min.dukun) {
                    recom.dukun -= 1;
                } else if (recom.penyihir > min.penyihir) {
                    recom.penyihir -= 1;
                } else if (recom.peramal > min.peramal) {
                    recom.peramal -= 1;
                } else if (recom.warga > min.warga) {
                    recom.warga -= 1;
                }
            }
            totalRecom -= 1;
        }

        return config;
    }

    /** Method untuk mendapatkan konfigurasi role 
     * @returns {RawRoleConfig}
     */
    getRoleConfiguration() {
        const config = {
            min: {
                warga: Math.max(1, Math.floor(this.playerCount * 0.3)), // Minimal 30% pemain
                peramal: 1,
                penyihir: 1,
                pemburu: this.playerCount < 9 ? 0 : 1,
                dukun: this.playerCount >= 10 ? 1 : 0,
                raja: 0,
                werewolf: 1,
                blackwolf: this.playerCount >= 30 ? 1 : 0,
                shapeshifter: 0
            },
            max: {
                warga: Math.floor(this.playerCount * 0.65), // Maksimal 65% pemain
                peramal: this.playerCount >= 30 ? 3 : 2, // Maksimal 3 untuk game besar
                penyihir: this.playerCount >= 30 ? 4 : 2, // Maksimal 4 untuk game besar
                pemburu: this.playerCount >= 30 ? 2 : 1, // Maksimal 2 untuk game besar
                dukun: this.playerCount >= 30 ? 3 : 1, // Maksimal 3 untuk game besar
                raja: this.playerCount >= 30 ? 1 : 0, // Maksimal 1, hanya untuk game besar
                werewolf: Math.min(6, Math.ceil(this.playerCount / 5)), // Maksimal 1 per 5 pemain
                blackwolf: this.playerCount >= 30 ? 2 : 1, // Maksimal 2 untuk game besar
                shapeshifter: this.playerCount >= 30 ? 1 : 0 // Maksimal 1, hanya untuk game besar
            },
            recom: {
                warga: Math.floor(this.playerCount * 0.4), // Rekomendasi 40% pemain
                peramal: this.playerCount >= 20 ? 2 : 1,
                penyihir: this.playerCount >= 20 ? this.playerCount >= 30 ? 3 : 2 : 1,
                pemburu: this.playerCount >= 20 ? 2 : this.playerCount < 9 ? 0 : 1,
                dukun: this.playerCount >= 15 ? 1 : 0,
                raja: this.playerCount >= 20 ? 1 : 0,
                werewolf: Math.min(4, Math.ceil(this.playerCount / 7)), // Rekomendasi 1 per 7 pemain
                blackwolf: this.playerCount >= 15 ? this.playerCount >= 35 ? 2 : 1 : 0,
                shapeshifter: this.playerCount >= 28 ? 1 : 0
            }
        };

        // Sesuaikan rekomendasi role
        return this._adjustRoleRecommendations(config);
    }

    /** Method untuk menghitung kekuatan manusia
     * @param {RoleConfig} roles 
     * @returns {Number}
     */
    calculateHumanStrength(roles) {
        let total = 0;
        for (const [role, count] of Object.entries(roles)) {
            if (this.humanRoleWeights[role]) {
                total += count * this.humanRoleWeights[role];
            }
        }
        return total;
    }

    /** Method untuk menghitung kekuatan werewolf
     * @param {RoleConfig} roles 
     * @returns {Number}
     */
    calculateWerewolfStrength(roles) {
        let total = 0;
        for (const [role, count] of Object.entries(roles)) {
            if (this.werewolfRoleWeights[role]) {
                total += count * this.werewolfRoleWeights[role];
            }
        }
        return total;
    }

    /** Method untuk mendapatkan persentase kekuatan manusia 
     * @param {RoleConfig} roles 
     * @returns {Number}
     */
    getHumanPercentage(roles) {
        const human = this.calculateHumanStrength(roles);
        const werewolf = this.calculateWerewolfStrength(roles);
        return (human / (human + werewolf)) * 100;
    }

    /** Method untuk mendapatkan persentase kekuatan werewolf
     * @param {RoleConfig} roles 
     * @returns {Number}
     */
    getWerewolfPercentage(roles) {
        return 100 - this.getHumanPercentage(roles);
    }

    /** Method untuk mendapatkan batas penggunaan kemampuan
     * @returns {RoleAbilityLimit}
     */
    getAbilityLimits() {
        return {
            penyihir: Math.min(3, 1 + Math.floor(this.playerCount / 15)),
            blackwolf: 1,
            shapeshifter: Math.min(2, Math.floor(this.playerCount / 20)),
            peramal: Math.min(5, Math.floor(this.playerCount / 10)), // Maksimal 5 kali
            pemburu: Math.min(5, Math.floor(this.playerCount / 10)), // Maksimal 3 kali
            dukun: Math.min(4, Math.floor(this.playerCount / 10)), // Maksimal 4 kali
            raja: Math.min(3, Math.floor(this.playerCount / 10)) // Maksimal 3 kali mencuri suara
        };
    }
}

export default RoleBalance;
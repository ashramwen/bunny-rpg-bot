const NormalState = require('./state/normal');
const DeadState = require('./state/dead');

/**
 * Character base class
 *
 */
class Character
{
    /**
     * Init player
     * @param initInfo
     * @constructor
     */
    constructor(initInfo) {

        this.status = {
            user_id: initInfo.user_id,
            name: initInfo.name,
            next_exp: 300,
            exp: 0,
            level: 1,
            hp: 100,
            max_hp: 100,
            mp: 20,
            max_mp: 20,
            str: 10,
            vit: 10,
            dex: 10,
            agi: 10,
            int: 10,
            luk: 10,
        };

        this.job = "無職業";
        this.title = "無稱號";
        this.state = Character.createState(NormalState.name(), this);
        this.expBase = 500;
    }

    /**
     * Get random number.
     * @param min
     * @param max
     * @return {*}
     */
    getRandom(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    computeHP() {
        throw new Error('Not implement method.');
    }

    computeMP() {
        throw new Error('Not implement method.');
    }

    computeSTR() {
        throw new Error('Not implement method.');
    }

    computeVIT() {
        throw new Error('Not implement method.');
    }

    computeDEX() {
        throw new Error('Not implement method.');
    }

    computeAGI() {
        throw new Error('Not implement method.');
    }

    computeINT() {
        throw new Error('Not implement method.');
    }

    computeLUK() {
        throw new Error('Not implement method.');
    }

    getStatus() {
        return this.status;
    }

    getName() {
        return this.status.name;
    }

    getJob() {
        return this.job;
    }

    getLevel() {
        return this.status.level;
    }

    getTitle() {
        return this.title;
    }

    getState() {
        return this.state;
    }

    getExp() {
        return this.status.exp;
    }

    /**
     * Create new state instance.
     * @param name {string}
     * @param context
     * @return {Normal}
     */
    static createState(name, context) {
        if (name == NormalState.name()) {
            return new NormalState(context);
        }
        if(name == DeadState.name()) {
            return new DeadState(context);
        }

        throw new Error("Change to unknown state error.");
    }

    /**
     * Change state to new state
     * @param name
     */
    changeState(name) {
        this.state.down();
        this.state = Character.createState(name, this);
        this.state.up();

        return this;
    }

    /**
     * Create damage info.
     * @return {{accuracy: number, value: number}}
     */
    createDamage() {
        // 傷害隨機倍率參數
        const atkParam = this.getRandom(80, 120) / 100;

        // 精准度隨機倍率參數
        const accParam = this.getRandom(80, 100) / 100;

        let value = this.status.str * atkParam * 10;
        let accuracy = this.status.dex * accParam;

        return {value: value, accuracy: accuracy};
    }

    /**
     * Check is dodged
     * @param damage {object} damage info
     * @return {boolean}
     */
    isDodge(damage) {
        // 迴避隨機倍率參數
        const dodgeParam = this.getRandom(90, 100) / 100;
        const baseDodgeProb = 20; // percentage

        let dodge = this.status.agi * dodgeParam;

        // 閃避補正
        let dodComp = dodge - damage.accuracy;
        if(dodComp < 0) {
            dodComp = 0;
        }
        if(dodComp > 100) {
            dodComp = 100;
        }

        if (this.getRandom(0, 100) <= (baseDodgeProb + dodComp)) {
            return true;
        }

        return false;
    }

    /**
     * Compute damage HP value.
     * @param damage
     * @return {number}
     */
    computeDamageHp(damage) {
        // 防禦隨機倍率參數
        const defParam = this.getRandom(90, 100) / 100;
        let defValue = this.status.vit * defParam * 3;

        let damageHp = Math.floor(damage.value - defValue);
        if (damageHp < 0) {
            damageHp = 0;
        }

        return damageHp;
    }

    receiveDamage(damage) {
        return this.state.receiveDamage(damage);
    }

    receivedExp(exp) {
        this.status.exp += exp;
        let isLevelUp = false;

        if (exp >= this.status.next_exp) {
            this.status.levelUp();
            isLevelUp = true;
        }

        return isLevelUp;
    }

    levelUp() {
        this.status.level += 1;
        this.status.next_exp = (this.status.level) * this.expBase;

        const hp = this.status.max_hp += this.computeHP();
        const mp = this.status.max_mp += this.computeMP();
        this.status = {
            hp: hp,
            max_hp: hp,
            mp: mp,
            max_mp: mp,
            str: this.status.str += this.computeSTR(),
            vit: this.status.vit += this.computeVIT(),
            dex: this.status.dex += this.computeDEX(),
            agi: this.status.agi += this.computeAGI(),
            int: this.status.int += this.computeINT(),
            luk: this.status.luk += this.computeLUK(),
        }
    }
}

module.exports = Character;
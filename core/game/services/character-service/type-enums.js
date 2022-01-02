const Player = require('./character/player/player');
const Monster = require('./character/monster/monster');

const AutoHpRegenBuff = require('./character/buff/auto-hp-regen-buff');
const AutoMpRegenBuff = require('./character/buff/auto-mp-regen-buff');
const AutoSpRegenBuff = require('./character/buff/auto-sp-regen-buff');

module.exports = {
    player: {
        proto: Player,
        defaults: {
            buffs: [AutoHpRegenBuff, AutoMpRegenBuff, AutoSpRegenBuff],
            skills: [
                {
                    standard_name: 'str-attack',
                    id: 75,
                    display_name: '攻擊',
                    level: 1,
                    type: 'standard',
                }
            ],
        }
    },
    monster: {
        proto: Monster,
        defaults: {
            buffs: [AutoHpRegenBuff, AutoMpRegenBuff, AutoSpRegenBuff],
            skills: [
                {
                    standard_name: 'str-attack',
                    id: 75,
                    display_name: '攻擊',
                    level: 1,
                    type: 'standard',
                }
            ],
        }
    },
};
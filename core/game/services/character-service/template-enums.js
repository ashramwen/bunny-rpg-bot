const Player = require('./character/player/player');

const Monster = require('./character/monster/monster');
const Goblin = require('./character/monster/goblin');
const Tauren = require('./character/monster/tauren');

module.exports = {
    player: {
        proto: Player,
    },
    monster: {
        proto: Monster,
    },
    goblin: {
        proto: Goblin,
    },
    tauren: {
        proto: Tauren,
    },
};
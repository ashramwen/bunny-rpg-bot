const Skill = require('./skill');

/**
 * StickAttack skill
 */
class StickAttack extends Skill
{
    /**
     * Get display name.
     * @return {string}
     */
    getDisplayName() {
        return "木棒敲擊";
    }

    /**
     * Get standard name.
     * @return {string}
     */
    getStandardName() {
        return "stick-attack";
    }

    /**
     * Hooker for before interaction
     * @param senders
     * @param receivers
     * @param action
     * @param args
     * @return {Promise<boolean>}
     */
    async beforeInteraction(senders, receivers, action, args) {
        const data = {
            skill: this,
            senders: senders,
            receivers: receivers,
            action: action,
            args: args
        };

        return await this.restrict(data,
            'characters-has-skill',
            'characters-cost-enough',
            'receivers-is-character',
        );
    }

    /**
     * Get cost info
     * @param options {object}
     * @return {{mp: number, hp: number, sp: number}}
     */
    getCost(options) {
        return {
            hp: 0,
            mp: 0,
            sp: 30,
        };
    }

    /**
     * Hooker for after interaction
     * @param senders
     * @param receivers
     * @param action
     * @param args
     * @return {Promise<void>}
     */
    async afterInteraction(senders, receivers, action, args) {

    }

    /**
     * Send effect data.
     * @param sender
     * @param receivers
     * @param action
     * @param args
     * @return {Promise<void>}
     */
    async sending(sender, receivers, action, args) {
        const damage = sender.createDamage();
        damage.value = damage.value * 2;
        action.writeMsg(`[${sender.getName()}] 掏出大隻木棒`).sendMsg();

        this.cost(sender);
        return damage;
    }
}


module.exports = StickAttack;

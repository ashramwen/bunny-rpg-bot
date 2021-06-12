

/**
 * Attack action.
 */
class Attack
{
    /**
     * Constructor
     * @param context
     */
    constructor(context) {
        this.context = context;
    }

    /**
     * Get action ID.
     * @return {string}
     */
    getId() {
        return "attack";
    }

    /**
     * Get action master name.
     * @return {string}
     */
    getNames() {
        return [
            "attack",
            "攻擊",
            "打",
            "Attack",
        ];
    }


    /**
     * Check actor can do the action.
     * @param actor
     * @return {boolean}
     */
    isActorCanAction(actor) {
        return true;
    }

    /**
     * Check action to the object.
     * @param object
     */
    isActionCanTo(object) {
        return true;
    }

    /**
     * Execute action.
     * @param actor
     * @param to
     */
    exec(actor, to) {
        this.isActorCanAction(actor);
        this.isActionCanTo(to);
    }

    getMessages() {

    }

}

module.exports = Attack;
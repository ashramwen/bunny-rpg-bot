
/**
 * Buff base class
 *
 */
class StandardBuff
{
    /**
     * Constructor
     *
     * @param character {Character}
     */
    constructor(character) {
        // not things to do.
    }

    /**
     * Set character as context.
     * @param character
     */
    setCharacter(character) {
        this.context = character;
    }

    /**
     * Trigger
     */
    trigger() {
        const time = this.getEffectTime();
        const self = this;
        this.up();
        this.interval = setInterval(function() {self.effect()}, this.getFrequency());

        this.timer = 0;
        this.timerInterval = setInterval(function() { self.timer++ }, 1000);

        if(time > 0) {
            setTimeout(() => {
                clearInterval(self.interval);
                self.down();
                this.context.removeBuff(self);
            }, time);
        }
    }

    /**
     * Getter for property ignore.
     * @return {function(*, *, *, *): boolean}
     */
    get ignore() {
        return this.getIgnoreCondition();
    }

    /**
     * Setter for property ignore.
     * @param argv
     */
    set ignore(argv) {
        throw new Error("Cannot set the protected property ignore.");
    }

    /**
     * Getter for property immediately
     */
    get immediately() {
        return this.getImmediatelyCondition();
    }

    /**
     * Setter for property immediately
     * @param argv
     */
    set immediately(argv) {
        throw new Error("Cannot set the protected property ignore.");
    }

    /**
     * Internal inject for ignore property.
     * @return {function(*, *, *, *): boolean}
     */
    getIgnoreCondition() {
        throw new Error('Not implement error.');
    }

    /**
     * Internal inject for immediately property.
     * @return {boolean}
     */
    getImmediatelyCondition() {
        return true;
    }

    /**
     * Get buff ID.
     * @return {string}
     */
    getId() {
        return "standard-buff";
    }

    /**
     * Get buff alias names
     * @return {Array}
     */
    getNames() {
        return [
            "standard-buff",
        ];
    }

    /**
     * Get buff name
     *
     * @return {string}
     */
    getDisplayName() {
        return "加護"
    }

    /**
     * Get context.
     * @return {Character}
     */
    getContext() {
        return this.context;
    }

    /**
     * Buff up
     * @param options
     */
    up(options) {
        // not things to do
    }

    /**
     * Buff down
     * @param options
     */
    down(options) {
        // not things to do
        clearInterval(this.timerInterval);
    }

    /**
     * Effective
     */
    effect() {
        // not things to do
    }

    /**
     * Define buff frequency
     *
     * @return {number} ms
     */
    getFrequency() {
        return 1;
    }

    /**
     * Define buff effect time
     *
     * @return {number} ms, if time = 0 forever
     */
    getEffectTime() {
        return 1;
    }

    /**
     * Getter for str
     * @return {number}
     */
    get str() {
        return 0;
    }

    /**
     * Getter for vit
     * @return {number}
     */
    get vit() {
        return 0;
    }

    /**
     * Getter for dex
     * @return {number}
     */
    get dex() {
        return 0;
    }

    /**
     * Getter for agi
     * @return {number}
     */
    get agi() {
        return 0;
    }

    /**
     * Getter for int
     * @return {number}
     */
    get int() {
        return 0;
    }

    /**
     * Getter for luk
     * @return {number}
     */
    get luk() {
        return 0;
    }
}

module.exports = StandardBuff;


const NormalState = require('./character/state/normal');
const DeadState = require('./character/state/dead');


const UserTypeEnums = require('./user-type-enums');
const TemplateEnums = require('./template-enums');

/**
 * Character service, service should run as singleton.
 */
class CharacterService
{
    /**
     * Constructor
     * @param context {GameEngine}
     */
    constructor(context) {
        this.context = context;
        this.initServiceModules();
    }

    /**
     * Define type name for GameEngine object pool.
     * @type {string}
     */
    static CHARACTER_OBJECT_TYPE = 'character';

    /**
     * Define model name for GameEngine create model.
     * @type {string}
     */
    static CHARACTER_MODEL = 'characters';

    /**
     * Characters user type enums.
     * @type {{PLAYER: string}}
     */
    static CHARACTER_TYPES = UserTypeEnums;

    /**
     * Characters template enums.
     * @type {{PLAYER: string}}
     */
    static CHARACTER_TEMPLATES = TemplateEnums;

    /**
     * Init service modules
     */
    initServiceModules() {
        console.info(`CharacterService: initServiceModules: Init...`);

        this.$const = {};
        this.$const.buff = 'buff';
        this.loadBuff();

        console.info(`CharacterService: initServiceModules: Finished`);
    }

    /**
     * Load buffs.
     * @return {CharacterService}
     */
    loadBuff() {
        const name = this.$const.buff;
        const loader = this.context.createLoader("CharacterService");
        const modulePath = `services/character-service/character/${name}`;

        this.context.modulePoolLoader(name, modulePath, loader);

        return this;
    }

    /**
     * Create character model instance.
     * @return {Users}
     */
    characterModel() {
        const model = CharacterService.CHARACTER_MODEL;
        return this.context.createModel(model);
    }

    /**
     * Create Buff instance.
     * @param name
     *
     * @return {StandardBuff}
     */
    createBuff(name) {
        // TODO implement.
    }

    /**
     * Create new character
     *
     * @param type {string} Character type
     * @param data {object} Character data
     */
    async new(type, data) {
        if (type == 'player') {

            const condition = { user_id: data.userId };
            const model = this.characterModel();
            if (!await model.exist(condition)) {
                throw new Error('User already created character error.');
            }

            const status = {name: data.name, user_id: data.userId};
            const character = this.createInstance(type).setStatus(status);
            await character.storeStatus(false);

            const record = await this.getRecordByCondition(condition);
            const id = record.id;

            this.initStatus(character, record);
            await this.initBuff(character, type, id);
            await this.initSkill(character, type, id);
            this.initWithObjectPool(character, id);

            return character;
        }

        if (type == 'monster') {
            throw new Error("Not support the character type 'monster now.");
            // const buffs = [AutoHpRegenBuff, AutoMpRegenBuff, AutoSpRegenBuff];
            // const monster = new Monster({ name: `怪物 LV.${data.level + 1}`, user_id: "SYSTEM", level: data.level, buffs: buffs }, this);
            // const objType = 'character';
            // const objectId = monster.getId();
            //
            // const soul = new DefaultSoul();
            // monster.setSoul(soul);
            //
            // const skills = [];
            // skills.push({
            //     standard_name: 'str-attack',
            //     id: 75,
            //     display_name: '攻擊',
            //     level: 1,
            //     type: 'standard',
            // });
            //
            // monster.setSkills(skills);
            //
            // this.context.setObject(objType, monster, objectId);
            //
            // return monster;
        }


        throw new Error('Create new character failed.');
    }

    /**
     * Get character instances by id list array, and ignore id if character not exists.
     * @param ids
     * @return {Promise<Array>}
     */
    async getByIds(ids) {
        const characters = [];

        for(let index in ids) {
            const id = ids[index];
            const character = await this.getById(id);
            if (character) {
                characters.push(character);
            }
        }

        return characters;
    }

    /**
     * Get a character record from database.
     * @param id {number} character id
     * @return {Promise<void>}
     */
    async getRecordById(id) {
        const model = this.characterModel();
        const records = await model.getById(id);
        if (records.length > 0) {
            return records[0];
        }

        throw new Error(`無法在資料庫找到角色資料: ID: ${id}`);
    }

    /**
     * Get a character record from database.
     * @param condition
     * @return {Promise<*>}
     */
    async getRecordByCondition(condition) {
        const model = this.characterModel();
        const records = await model.getRecord(condition);
        if (records.length > 0) {
            return records[0];
        }

        throw new Error(`無法在資料庫找到角色資料: Condition: ${condition}`);
    }

    /**
     * Get character's skill records.
     * @param characterType {string}
     * @param characterId {number}
     * @return {Promise<*>}
     */
    async getCharacterSkillRecords(characterType, characterId) {
        const model = this.characterModel();
        return await model.resetQueryBuilder()
            .where({ 'characters.id': characterId })
            .skills();
    }

    /**
     * Get characters default skill records.
     * @param characterType {string}
     * @param characterId {number}
     * @return {Promise<*>}
     */
    async getDefaultSkills(characterType, characterId) {
        const defaults = CharacterService.CHARACTER_TYPES[characterType].defaults;
        return defaults.skills;
    }

    /**
     * Get character default buff records.
     * @param characterType
     * @param characterId
     * @return {Promise<*>}
     */
    async getDefaultBuffs(characterType, characterId) {
        const defaults = CharacterService.CHARACTER_TYPES[characterType].defaults;
        return defaults.buffs;
    }

    /**
     * Create character instance.
     * @param type {string} User type name.
     * @param template {string} Template name.
     * @return {Character}
     */
    createInstance(type, template) {
        const Prototype = CharacterService.CHARACTER_TEMPLATES[template].proto;
        return new Prototype({}, this);
    }

    /**
     * Init a character instance into service collection.
     * @param type {CharacterService.CHARACTER_TYPES}
     * @param id
     * @return {Promise<Character>}
     */
    async initById(id) {
        const record = await this.getRecordById(id);
        const type = record.user_type;
        const template = record.template;

        const character = this.createInstance(type, template);

        this.initStatus(character, record);
        await this.initBuff(character, type, id);
        await this.initSkill(character, type, id);
        this.initWithObjectPool(character, id);

        return character;
    }

    /**
     * Init character status properties.
     * @param character
     * @param info {CharacterRecord|Object}
     * @return {CharacterService}
     */
    initStatus(character, info) {
        info.hp = info.max_hp;
        info.mp = info.max_mp;
        info.sp = info.max_sp;
        character.setStatus(info);

        return this;
    }

    /**
     * Init character buff properties.
     * @param character
     * @param type
     * @param id
     * @return {Promise<void>}
     */
    async initBuff(character, type, id) {
        const buffs = await this.getDefaultBuffs(type, id);
        character.setBuffsByPrototype(buffs);
    }

    /**
     * Init character skill properties
     * @param character
     * @param type
     * @param id
     * @return {Promise<void>}
     */
    async initSkill(character, type, id) {
        const defaultSkill = await this.getDefaultSkills(type, id);
        const characterSkills = await this.getCharacterSkillRecords(type, id);
        const skills = defaultSkill.concat(characterSkills);
        character.setSkills(skills);
    }

    /**
     * Init character with GameEngine object pool
     * @param character
     * @param id
     */
    initWithObjectPool(character, id) {
        const objType = CharacterService.CHARACTER_OBJECT_TYPE;
        this.context.setObject(objType, character, id);
    }

    /**
     * Get character instance.
     * @param idgetById
     * @return {Promise<*>}
     */
    async getById(id) {
        const objType = CharacterService.CHARACTER_OBJECT_TYPE;
        if (this.context.hasObject(objType, id)) {
            return this.context.getObject(objType, id);
        }
        else {
            return await this.initById(id);
        }
    }

    /**
     * Get character instance.
     * @param condition {object}
     * @return {Promise<void>}
     */
    async getByCondition(condition) {
        const record = await this.getRecordByCondition(condition);
        return await this.getById(record.id);
    }

    /**
     * Get class
     * @return {Normal}
     * @constructor
     */
    get NormalState() {
        return NormalState;
    }

    /**
     * Get class
     * @return {Dead}
     * @constructor
     */
    get DeadState() {
        return DeadState;
    }
}


module.exports = CharacterService;


var assert = require('assert');

describe('Mongo', () => {
    const Mongo = require('../lib/main');
    let mongo;
    let DB_URL = process.env.DB_URL || 'mongodb://localhost:27017';
    let DB_AUTH_URL = process.env.DB_AUTH_URL || 'mongodb://localhost:27018';
    const SETTINGS = { url: DB_URL, name: 'nodeTest' };

    describe('#id(value)', function(){

        beforeEach(function(){
            mongo = new Mongo();
        });

        it('should return false when value is invalid id', function(){
            assert.equal(mongo.id(null), false);
            assert.equal(mongo.id('not id'), false);
        });

        it('should return an instance of mongo ObjectId', function(){
            assert.equal(typeof mongo.id(90), 'object');
            assert.equal(typeof mongo.id('afe645378fab'), 'object');
        });

    });

    describe('#connect(settings)', function(){

        beforeEach(function(){
            mongo = new Mongo();
        });

        it('should fail when missing arguments', async function(){
            this.timeout(3000);
            await assert.rejects(async function(){
                await mongo.connect();
            });
        });

        it('should not connect to inexisting database', async function(){
            this.timeout(3000);
            await assert.rejects(async function(){
                await mongo.connect({ url: 'blabla', name: 'blabla' });
            });
        });

        it('should connect to database when settings are valid', async function(){
            this.timeout(3000);
            await mongo.connect(SETTINGS);
            mongo.close();
        });

        it('should connect to auth enabled database when settings include credentials', async function(){
            this.timeout(3000);
            await assert.doesNotReject(function(){
                return mongo.connect({ url: DB_AUTH_URL, name: 'nodeTest', user: 'root', password: '234789' });
            });
            mongo.close();
        });

    });

    describe('#insert(collection, doc)', function(){

        beforeEach(async function(){
            mongo = new Mongo();
            await mongo.connect(SETTINGS);
        });

        afterEach(function(){
            mongo.close();
        });

        it('should not insert when missing arguments', async function(){
            await assert.rejects( async function(){
                await mongo.insert();
            });
        });

        it('should not insert when collection name is invalid', async function(){
            await assert.rejects( async function(){
                await mongo.insert('8test$', {});
            });
        });

        it('should insert collection when everything is okay', async function(){
            await mongo.insert('test', { msg: 'test' });
        });

    });

    describe('#exists(collection, key, value)', function(){

        beforeEach(async function(){
            mongo = new Mongo();
            await mongo.connect(SETTINGS);
            await mongo.db.dropDatabase('nodeTest');
        });

        afterEach(function(){
            mongo.close();
        });

        it('should not search when missing arguments', async function(){
            await assert.rejects( async function(){
                await mongo.exists();
            });
        });

        it('should return false when document does not exist', async function(){
            assert(!await mongo.exists('test', 'msg', 'test1'));
        });

        it('should find documents collection when everything is okay', async function(){
            await mongo.insert('test', { msg: 'test1' });
            await mongo.insert('test', { msg: 'test2' });
            await mongo.insert('test', { msg: 'test1' });
            assert(await mongo.exists('test', 'msg', 'test1'));
        });

    });

    describe('#get(collection, key, value)', function(){

        beforeEach(async function(){
            mongo = new Mongo();
            await mongo.connect(SETTINGS);
            await mongo.db.dropDatabase('nodeTest');
        });

        afterEach(function(){
            mongo.close();
        });

        it('should not search when missing arguments', async function(){
            await assert.rejects( async function(){
                await mongo.get();
            });
        });

        it('should return false when document does not exist', async function(){
            assert(!await mongo.get('test', 'msg', 'test1'));
        });

        it('should return documents collection when everything is okay', async function(){
            await mongo.insert('test', { msg: 'test1' });
            await mongo.insert('test', { msg: 'test2' });
            await mongo.insert('test', { msg: 'test1' });
            assert.equal(typeof await mongo.get('test', 'msg', 'test1'), 'object');
        });

    });

    describe('#find(collection, query)', function(){

        beforeEach(async function(){
            mongo = new Mongo();
            await mongo.connect(SETTINGS);
            await mongo.db.dropDatabase('nodeTest');
        });

        afterEach(function(){
            mongo.close();
        });

        it('should not search when missing arguments', async function(){
            await assert.rejects( async function(){
                await mongo.find();
            });
        });

        it('should return false when document does not exist', async function(){
            let r = await mongo.find('test', { 'msg': 'test1' });
            assert.equal(r.length, 0);
        });

        it('should return documents collection when everything is okay', async function(){
            await mongo.insert('test', { msg: 'test1' });
            await mongo.insert('test', { msg: 'test2' });
            await mongo.insert('test', { msg: 'test1' });
            let r = await mongo.find('test');
            assert.equal(typeof r, 'object');
            assert.equal(r.length, 3);
        });

    });

    describe('#delete(collection, key, value)', function(){

        beforeEach(async function(){
            mongo = new Mongo();
            await mongo.connect(SETTINGS);
            await mongo.db.dropDatabase('nodeTest');
        });

        afterEach(function(){
            mongo.close();
        });

        it('should not delete when missing arguments', async function(){
            await assert.rejects( async function(){
                await mongo.delete();
            });
        });

        it('should return zero when document does not exist', async function(){
            assert.equal(await mongo.delete('test', 'msg', 'test1'), 0);
        });

        it('should delete the document when everything is okay', async function(){
            await mongo.insert('test', { msg: 'test1' });
            await mongo.insert('test', { msg: 'test2' });
            await mongo.delete('test', 'msg', 'test1');
            assert(!await mongo.get('test', 'msg', 'test1'));
        });

    });

    describe('#update(collection, key, value, spec)', function(){

        beforeEach(async function(){
            mongo = new Mongo();
            await mongo.connect(SETTINGS);
            await mongo.db.dropDatabase('nodeTest');
        });

        afterEach(function(){
            mongo.close();
        });

        it('should not update when missing arguments', async function(){
            await assert.rejects( async function(){
                await mongo.update();
            });
        });

        it('should return false when document does not exist', async function(){
            assert(!await mongo.update('test', 'msg', 'test1', { '$set': {test: ''} }));
        });

        it('should update the document when everything is okay', async function(){
            await mongo.insert('test', { msg: 'test1' });
            await mongo.update('test', 'msg', 'test1', { '$set': { msg: 'test2' }});
            let doc = await mongo.get('test', 'msg', 'test2');
            assert.equal(doc.msg, 'test2');
        });

    });

    describe('#replace(collection, key, value, doc)', function(){

        beforeEach(async function(){
            mongo = new Mongo();
            await mongo.connect(SETTINGS);
            await mongo.db.dropDatabase('nodeTest');
        });

        afterEach(function(){
            mongo.close();
        });

        it('should not update when missing arguments', async function(){
            await assert.rejects( async function(){
                await mongo.replace();
            });
        });

        it('should return false when document does not exist', async function(){
            assert(!await mongo.replace('test', 'msg', 'test1', { test: '' }));
        });

        it('should update the document when everything is okay', async function(){
            await mongo.insert('test', { msg: 'test1' });
            await mongo.replace('test', 'msg', 'test1', { msg: 'test2' });
            let doc = await mongo.get('test', 'msg', 'test2');
            assert.equal(doc.msg, 'test2');
        });

    });

    describe('#push(collection, key, value, spec)', function(){

        beforeEach(async function(){
            mongo = new Mongo();
            await mongo.connect(SETTINGS);
            await mongo.db.dropDatabase('nodeTest');
        });

        afterEach(function(){
            mongo.close();
        });

        it('should not push when missing arguments', async function(){
            await assert.rejects( async function(){
                await mongo.push();
            });
        });

        it('should return false when document does not exist', async function(){
            assert(!await mongo.push('test', 'msg', 'test1', { test: '' }));
        });

        it('should push to the specified array when everything is okay', async function(){
            await mongo.insert('test', { id: 'hehe', msgs: ['test1'] });
            await mongo.push('test', 'id', 'hehe', { msgs: 'test2' });
            let doc = await mongo.get('test', 'id', 'hehe');
            assert.equal(doc.msgs[1], 'test2');
        });

    });

    describe('#pull(collection, key, value, spec)', function(){

        beforeEach(async function(){
            mongo = new Mongo();
            await mongo.connect(SETTINGS);
            await mongo.db.dropDatabase('nodeTest');
        });

        afterEach(function(){
            mongo.close();
        });

        it('should not pull when missing arguments', async function(){
            await assert.rejects( async function(){
                await mongo.pull();
            });
        });

        it('should return false when document does not exist', async function(){
            assert(!await mongo.pull('test', 'msg', 'test1', { test: '' }));
        });

        it('should pull to the specified item when everything is okay', async function(){
            await mongo.insert('test', { id: 'hehe', msgs: ['test1', 'test2'] });
            await mongo.pull('test', 'id', 'hehe', { msgs: 'test2' });
            let doc = await mongo.get('test', 'id', 'hehe');
            assert.equal(doc.msgs.length, 1);
        });

    });

    describe('#close()', function(){

        beforeEach(function(){
            mongo = new Mongo();
        });

        it('should not fail even when no connection is stablished', function(){
            mongo.close();
        });

        it('should close a connection just fine', async function(){
            await mongo.connect(SETTINGS);
            mongo.close();
        });

    });

    describe('#index(collection, spec)', function(){

        beforeEach(async function(){
            mongo = new Mongo();
            await mongo.connect(SETTINGS);
            await mongo.db.dropDatabase('nodeTest');
        });

        afterEach(function(){
            mongo.close();
        });

        it('should create index just fine', async function(){
            await mongo.index('test', { a: 1 }, { unique: true });
            await mongo.insert('test', { a: 'foo' });
            await assert.rejects(mongo.insert('test', { a: 'foo' }));
        });

    });

});

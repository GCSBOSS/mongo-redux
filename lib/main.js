const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

/*============================================================================o\
    An instance of this class represents a mongodb server.
\o============================================================================*/
module.exports = class Mongo{

    /*------------------------------------------------------------------------o\
        Return a MongoDB ID object if @value is a valid hex string.
    \o------------------------------------------------------------------------*/
    id(value){
        return ObjectId.isValid(value) ? ObjectId(value) : false;
    }

    /*------------------------------------------------------------------------o\
        Connect to the mongodb instance specified in @settings.
    \o------------------------------------------------------------------------*/
    async connect(settings){

        // Validate settings.
        settings = settings || {};
        assert(typeof settings.url == 'string');
        assert(typeof settings.name == 'string');

        // Add mongodb auth credentials, if ssetup.
        if(typeof settings.user == 'string')
            var auth = { user: settings.user, password: settings.password };

        // Attempt connection to mongodb.
        try{
            this.conn = await MongoClient.connect(settings.url, {
                auth: auth || false,
                authSource: 'admin',
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }
        catch(e){
            throw Error('Unable to connect to ' + settings.url);
        }

        // Keep a reference of the specified database.
        this.db = this.conn.db(settings.name);
    }

    /*------------------------------------------------------------------------o\
        Insert the @doc object as a document in the @collection.
    \o------------------------------------------------------------------------*/
    async insert(collection, doc){

        // Validate input arguments.
        assert(typeof collection == 'string');
        assert(typeof doc == 'object');

        // Send the object to the database for insertion.
        let r = await this.db.collection(collection).insertOne(doc);

        // Return according to status of operation.
        return r.insertedCount
            ? String(r.insertedId)
            : /* istanbul ignore next */ false;
    }

    /*------------------------------------------------------------------------o\
        Return whether a document with a @key of @value exists in the
        @collection.
    \o------------------------------------------------------------------------*/
    async exists(collection, key, value){

        // Validate input arguments.
        assert(typeof collection == 'string');
        assert(typeof key == 'string');
        assert(value != undefined);

        // Query the database for the document.
        let c = this.db.collection(collection);
        return Boolean(await c.findOne({ [key]: value }));
    }

    /*------------------------------------------------------------------------o\
        Return the first doc in @collection with @key of @value.
    \o------------------------------------------------------------------------*/
    async get(collection, key, value){

        // Validate input arguments.
        assert(typeof collection == 'string');
        assert(typeof key == 'string');
        assert(value != undefined);

        // Query database for the document.
        let c = this.db.collection(collection);
        return await c.findOne({ [key]: value }) || false;
    }

    /*------------------------------------------------------------------------o\
        Return all docs in @collection. Filter according to @query if present.
    \o------------------------------------------------------------------------*/
    async find(collection, query, projection){

        // Validate input arguments.
        assert(typeof collection == 'string');
        if(query != undefined)
            assert(typeof query == 'object');

        // Query database for the documents.
        let opts = { projection: projection };
        let c = await this.db.collection(collection).find(query, opts);
        return await c.toArray();
    }

    /*------------------------------------------------------------------------o\
        Find and delete the first doc in @collection with @key of @value.
    \o------------------------------------------------------------------------*/
    async delete(collection, key, value){

        // Validate input arguments.
        assert(typeof collection == 'string');
        assert(typeof key == 'string');
        assert(value != undefined);

        // Query database for the document and attempt deletion.
        let c = this.db.collection(collection);
        let r = await c.findOneAndDelete({ [key]: value });

        // Return according to operation result.
        return r.ok
            ? r.lastErrorObject.n
            : /* istanbul ignore next */ false;
    }

    /*------------------------------------------------------------------------o\
        Find and update with @spec the first doc in @collection with @key of
        @value.
    \o------------------------------------------------------------------------*/
    async update(collection, key, value, spec){

        // Validate input arguments.
        assert(typeof collection == 'string');
        assert(typeof key == 'string');
        assert(value != undefined);
        assert(typeof spec == 'object');

        // Query database for the document and attempt update.
        let c = this.db.collection(collection);
        let r = await c.findOneAndUpdate({ [key]: value }, spec);

        // Return according to operation result.
        return r.ok
            ? r.lastErrorObject.n
            : /* istanbul ignore next */ false;
    }

    /*------------------------------------------------------------------------o\
        Replace with @doc the first doc in @collection with @key of @value.
    \o------------------------------------------------------------------------*/
    async replace(collection, key, value, doc){
        return await this.update(collection, key, value, { '$set': doc });
    }

    /*------------------------------------------------------------------------o\
        Push the @spec array field of the first doc in @collection with @key
        of @value.
    \o------------------------------------------------------------------------*/
    async push(collection, key, value, spec){
        return await this.update(collection, key, value, { '$push': spec });
    }

    /*------------------------------------------------------------------------o\
        Pull the @spec array field of the first doc in @collection with @key
        of @value.
    \o------------------------------------------------------------------------*/
    async pull(collection, key, value, spec){
        return await this.update(collection, key, value, { '$pull': spec });
    }

    /*------------------------------------------------------------------------o\
        Closes the mongodb connection if stablished.
    \o------------------------------------------------------------------------*/
    close(){
        if(this.conn)
            this.conn.close();
    }

    async index(collection, ...spec){
        assert(typeof collection == 'string');
        assert(typeof spec == 'object');
        let c = this.db.collection(collection);
        return await c.createIndex(...spec);
    }
};

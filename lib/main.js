const { ObjectId, MongoClient } = require('mongodb');

let colProto = {

    async insert(doc){
        let count = Array.isArray(doc) ? doc.length : 1;

        if(count > 1)
            var r = await this.insertMany(doc);
        else
            r = await this.insertOne(doc);

        if(r.insertedCount < count)
            throw new Error('Failed to insert some records');


        return r.insertedId.toString();
    }

};

let proto = {

    db(name){
        if(this.conn)
            this.db = this.conn.db(name);
        return this;
    },

    collections(...args){
        if(this.db)
            args.forEach(c => {
                this[c] = this.db.collection(c);
                Object.assign(this[c], colProto);
            });
        return this;
    },

    async close(){
        if(this.conn){
            await this.conn.close();
            this.conn = null;
        }
    },

    id(value){
        return ObjectId.isValid(value) ? ObjectId(value) : false;
    }

}


module.exports = {

    async connect(conf){
        let url = conf.url;
        delete conf.url;

        let dbName = conf.dbName;
        delete conf.dbName;

        let mongo = {};

        mongo.conn = await MongoClient.connect(url, {
            ...conf,
            authSource: 'admin',
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        Object.assign(mongo, proto);

        if(dbName)
            mongo.db(dnName);

        return mongo;
    }

};


//     async exists(collection, key, value){
//
//         // Validate input arguments.
//         assert(typeof collection == 'string');
//         assert(typeof key == 'string');
//         assert(value != undefined);
//
//         // Query the database for the document.
//         let c = this.db.collection(collection);
//         return Boolean(await c.findOne({ [key]: value }));
//     }
//
//     /*------------------------------------------------------------------------o\
//         Return the first doc in @collection with @key of @value.
//     \o------------------------------------------------------------------------*/
//     async get(collection, key, value){
//
//         // Validate input arguments.
//         assert(typeof collection == 'string');
//         assert(typeof key == 'string');
//         assert(value != undefined);
//
//         // Query database for the document.
//         let c = this.db.collection(collection);
//         return await c.findOne({ [key]: value }) || false;
//     }
//
//     /*------------------------------------------------------------------------o\
//         Return all docs in @collection. Filter according to @query if present.
//     \o------------------------------------------------------------------------*/
//     async find(collection, query, projection){
//
//         // Validate input arguments.
//         assert(typeof collection == 'string');
//         if(query != undefined)
//             assert(typeof query == 'object');
//
//         // Query database for the documents.
//         let opts = { projection: projection };
//         let c = await this.db.collection(collection).find(query, opts);
//         return await c.toArray();
//     }
//
//     /*------------------------------------------------------------------------o\
//         Find and delete the first doc in @collection with @key of @value.
//     \o------------------------------------------------------------------------*/
//     async delete(collection, key, value){
//
//         // Validate input arguments.
//         assert(typeof collection == 'string');
//         assert(typeof key == 'string');
//         assert(value != undefined);
//
//         // Query database for the document and attempt deletion.
//         let c = this.db.collection(collection);
//         let r = await c.findOneAndDelete({ [key]: value });
//
//         // Return according to operation result.
//         return r.ok
//             ? r.lastErrorObject.n
//             : /* istanbul ignore next */ false;
//     }
//
//     /*------------------------------------------------------------------------o\
//         Find and update with @spec the first doc in @collection with @key of
//         @value.
//     \o------------------------------------------------------------------------*/
//     async update(collection, key, value, spec){
//
//         // Validate input arguments.
//         assert(typeof collection == 'string');
//         assert(typeof key == 'string');
//         assert(value != undefined);
//         assert(typeof spec == 'object');
//
//         // Query database for the document and attempt update.
//         let c = this.db.collection(collection);
//         let r = await c.findOneAndUpdate({ [key]: value }, spec);
//
//         // Return according to operation result.
//         return r.ok
//             ? r.lastErrorObject.n
//             : /* istanbul ignore next */ false;
//     }
//
//     /*------------------------------------------------------------------------o\
//         Replace with @doc the first doc in @collection with @key of @value.
//     \o------------------------------------------------------------------------*/
//     async replace(collection, key, value, doc){
//         return await this.update(collection, key, value, { '$set': doc });
//     }
//
//     /*------------------------------------------------------------------------o\
//         Push the @spec array field of the first doc in @collection with @key
//         of @value.
//     \o------------------------------------------------------------------------*/
//     async push(collection, key, value, spec){
//         return await this.update(collection, key, value, { '$push': spec });
//     }
//
//     /*------------------------------------------------------------------------o\
//         Pull the @spec array field of the first doc in @collection with @key
//         of @value.
//     \o------------------------------------------------------------------------*/
//     async pull(collection, key, value, spec){
//         return await this.update(collection, key, value, { '$pull': spec });
//     }


# Mongo Redux

Mongo Redux is a thin wrapper around MongoDB basic functionality. Aims to provide
simple functions on the async/await pattern for short and readable commands.

## Get Started
1. Add to your project with: `npm i mongo-redux`.
2. In your code:

```js
// Import the module
const Mongo = require('mongo-redux');

// Instance a new client
let mongo = new Mongo();

// Start a connection
await mongo.connect('mongodb://127.0.0.1:27017');

// Use functionallity

// insert ( collection, data ) => Boolean
await mongo.insert('Test', { data: 'My Test Document' });

// exists ( collection, key, value ) => Boolean
await mongo.exists('Test', '_id', db.id(myId));

// get ( collection, key, value ) => Object | false
await mongo.get('Test', '_id', db.id(myId));

// find ( collection, query, projection ) => Array | false
await mongo.find('Test', { data: 'My Test Document' }, { _id: 0, name: 1 });

// delete ( collection, key, value ) => Boolean
await mongo.delete('Test', '_id', db.id(myId));

// update ( collection, key, value, updateSpec ) => Boolean
await mongo.update('Test', '_id', db.id(myId), { '$set': { name: 'New Name' } });

// replace ( collection, key, value, replacements ) => Boolean
await mongo.replace('Test', '_id', db.id(myId), { name: 'New Name' });

// push ( collection, key, value, arrayAndNewValue ) => Boolean
await mongo.push('Test', '_id', db.id(myId), { products: 'Cool Product 17' });

// pull ( collection, key, value, arrayAndTargetValue ) => Boolean
await mongo.pull('Test', '_id', db.id(myId), { products: 'Awful Product 16' });

// Create indexes
await mongo.index('Test', { email: 1 }, { unique: true });

// Access mongodb Database object
let info = await mongo.db.collectionsInfo();

// Close the connection
await mongo.close();
```

## Reporting Bugs
If you have found any problems with this module, please:

1. [Open an issue](https://gitlab.com/GCSBOSS/mongo-redux/issues/new).
2. Describe what happened and how.
3. Also in the issue text, reference the label `~bug`.

We will make sure to take a look when time allows us.

## Proposing Features
If you wish to have that awesome feature or have any advice for us, please:
1. [Open an issue](https://gitlab.com/GCSBOSS/mongo-redux/issues/new).
2. Describe your ideas.
3. Also in the issue text, reference the label `~proposal`.

## Contributing
If you have spotted any enhancements to be made and is willing to get your hands dirty about it, fork us and [submit your merge request](https://gitlab.com/GCSBOSS/mongo-redux/merge_requests/new) so we can collaborate effectively.

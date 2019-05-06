
# Mongo Redux

Mongo Redux is a thin wrapper around MongoDB basic functionality. Aims to provide
simple functions on the async/await pattern for short and readable commands.

## Get Started
1. Add to your project with: `npm i mongo-redux`.
2. In your code:

```js
// Import the module
const DataBase = require('mongo-redux');

// Instance a new client
let db = new DataBase();

// Start a connection
await db.connect('mongodb://127.0.0.1:27017');

// Use functionallity
await db.insert('Test', { data: 'My Test Document' });

// Close the connection
await db.close();
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

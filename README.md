# long-promise

Long stack traces with Promises, using the brand-new `async_hooks` API provided by Node 8.0.0.

```JS
const lp = require('./index.js');

lp.enable();

// Simulate some stuff
const stuff = x => 2 + x;

// Simulate a delay.
const delay = ms => x => {
    // This function is `buggy` and will throw if the delay is 100ms.
    if (ms === 100) throw new Error('boom');

    return new Promise(res => {
        setTimeout(() => {
            res(x);
        }, ms);
    });
};

const nestedProblems = x => () => {
    // After the third call, go to an eventual `delay(100)` that throws
    if (x === 3) return Promise.resolve(1).then(delay(100));

    // Promise chain with recursion
    return Promise.resolve(1)
        .then(delay(10))
        .then(stuff)
        .then(nestedProblems(x + 1));
};

// Main program
function run() {
    const p = Promise.resolve(2);

    // Do some things. Something along this promise chain will throw.
    p.then(stuff)
        .then(delay(10))
        .then(stuff)
        .then(delay(10))
        .then(stuff)
        .then(nestedProblems(1))
        .then(stuff)
        .then(stuff)
        .catch(err => {
            console.log(lp.getLongStack(err));
            // Profit
        });
}

run();
```

This produces the following stack trace:

```
Error: boom
    at x (/Users/mvaldes/Sandbox/long-promise/example.js:12:27)
    at <anonymous>
    at Promise.then (<anonymous>)
    at /Users/mvaldes/Sandbox/long-promise/example.js:23:44
    at <anonymous>
    at Promise.then (<anonymous>)
    at /Users/mvaldes/Sandbox/long-promise/example.js:29:10
    at <anonymous>
    at Promise.then (<anonymous>)
    at /Users/mvaldes/Sandbox/long-promise/example.js:29:10
    at <anonymous>
    at Promise.then (<anonymous>)
    at run (/Users/mvaldes/Sandbox/long-promise/example.js:42:10)
    at Object.<anonymous> (/Users/mvaldes/Sandbox/long-promise/example.js:51:1)
    at Module._compile (module.js:569:30)
    at Object.Module._extensions..js (module.js:580:10)
```

Without `long-promise` enabled, the original stack trace is the following:

```
Error: boom
    at x (/Users/mvaldes/Sandbox/long-promise/example.js:12:27)
    at <anonymous>
```

This is very early work, any contributions are welcome.

# install
with [npm](https://npmjs.org) do:

```
npm install long-promise
```

# license

MIT

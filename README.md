# long-promise

Long stack traces with Promises, using the brand-new `async_hooks` API provided by Node 8.0.0.

For the moment this is just a POC. Feel free to take a look at the sample situation in the index.js file.

The produced stack trace is the following (library files removed):

```
Error: boom
    at x (/Users/mvaldes/Sandbox/long-promise/index.js:11:27)
    at then (/Users/mvaldes/Sandbox/long-promise/index.js:22:44)
    at then (/Users/mvaldes/Sandbox/long-promise/index.js:28:10)
    at then (/Users/mvaldes/Sandbox/long-promise/index.js:28:10)
    at run (/Users/mvaldes/Sandbox/long-promise/index.js:43:10)
    at Object.<anonymous> (/Users/mvaldes/Sandbox/long-promise/index.js:52:1)
```

Compared to the "normal" stack trace (library files removed):

```
Error: boom
    at x (/Users/mvaldes/Sandbox/long-promise/index.js:11:27)
    at <anonymous>
```

In a more illustrative way:

###### at x (/Users/mvaldes/Sandbox/long-promise/index.js:11:27)
![First Line](https://i.imgur.com/eFTQQVP.png)
###### at then (/Users/mvaldes/Sandbox/long-promise/index.js:22:44)
![Second Line](https://i.imgur.com/08qsnDv.png)
###### at then (/Users/mvaldes/Sandbox/long-promise/index.js:28:10)
![Third Line](https://i.imgur.com/QbCOvE7.png)
###### at then (/Users/mvaldes/Sandbox/long-promise/index.js:28:10)
![Fourth Line](https://i.imgur.com/QbCOvE7.png)
###### at run (/Users/mvaldes/Sandbox/long-promise/index.js:43:10)
![Fifth Line](https://i.imgur.com/X795KQu.png)
###### at Object.<anonymous> (/Users/mvaldes/Sandbox/long-promise/index.js:52:1)
![Sixth Line](https://i.imgur.com/j7Y5I3U.png)

We can now follow the complete flow of the program, from the beginning of execution up until the error is triggered,
including the two steps of recursion.

# install
with [npm](https://npmjs.org) do:

```
npm install long-promise
```

# license

MIT

const _then = Promise.prototype.then;

const instrumentedThen = pushErrorContext => {
    // We need a real function for `this` to work as expected
    return function(res, rej) {
        const _res = function(x) {
            try {
                let val = res(x);
                return val;
            } catch (err) {
                pushErrorContext();
                throw err;
            }
        };

        return _then.call(this, _res, rej);
    };
};

// Sadly, it appears that the native `throws` occur asynchronously. This means by the time we pick up an error has happened,
// there is nothing to link us back to the execution context that triggered the error.
// To get around this limitation, we are forced to instrument the `Promise.prototype.then` method,
// such that we are able to detect any errors caused by the callbacks while we are still in the same execution context,
// save a reference to the context, then rethrow the error.
// This of course means that the stack traces will include our instrumentation,
// which is why we provide a way to filter the results when requesting a long stack trace.

const patch = pushErrorContext => Promise.prototype.then = instrumentedThen(pushErrorContext);
const restore = () => Promise.prototype.then = _then;

module.exports = {
    patch,
    restore
};

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

const patch = pushErrorContext => Promise.prototype.then = instrumentedThen(pushErrorContext);
const restore = () => Promise.prototype.then = _then;

module.exports = {
    patch,
    restore
};

const hook = require('./hook.js');
const promise = require('./promise.js');

function enable() {
    promise.patch(hook.pushErrorContext);
    hook.enable();
}

function disable() {
    hook.disable();
    promise.restore();
}

function getLongStack(err, filter) {
    return hook.getLongStack(err, filter);
}

module.exports = {
    enable,
    disable,
    getLongStack
};

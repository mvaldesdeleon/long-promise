const hook = require('./hook.js');
const promise = require('./promise.js');

const moduleFiles = line => !line.match(/async_hooks.js|long-promise\/(hook|promise).js/);

function enable() {
    promise.patch(hook.pushErrorContext);
    hook.enable();
}

function disable() {
    hook.disable();
    promise.restore();
}

function getLongStack(err) {
    return hook.getLongStack(err, moduleFiles);
}

module.exports = {
    enable,
    disable,
    getLongStack
};

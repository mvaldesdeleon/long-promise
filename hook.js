const asyncHooks = require('async_hooks');

const head = array => array.length ? array[array.length - 1] : null;

let promiseData;
let contextStack;
let errorStack;

const parseStack = stack => stack.split('\n').slice(1);
const getStack = () => parseStack((new Error()).stack);
const getContext = () => contextStack.slice();
const pushErrorContext = () => errorStack.push(getContext());
const getLastErrorContext = () => head(errorStack);

function init(id, type, triggerId) {
    if (type !== 'PROMISE') return;

    promiseData.set(id, {
        stack: getStack(),
        context: getContext(),
        trigger: triggerId
    });
}

function before(id) {
    if (!promiseData.has(id)) return;

    contextStack.push(id);
}

function after(id) {
    if (!promiseData.has(id)) return;

    contextStack.pop();
}

function destroy(id) {
    if (!promiseData.has(id)) return;

    promiseData.delete(id);
}

const hook = asyncHooks.createHook({
    init, before, after, destroy
});

function enable() {
    hook.enable();
}

function disable() {
    hook.disable();
    clearData();
}

function getLongStack(err, filter = () => true) {
    const errorContext = head(getLastErrorContext());
    const headline = err.stack.split('\n')[0];

    let longStack = parseStack(err.stack);
    let nextContext = errorContext;

    while (promiseData.has(nextContext)) {
        let nextContextData = promiseData.get(nextContext);

        longStack = longStack.concat(nextContextData.stack);
        nextContext = head(nextContextData.context);
    }
    return headline + '\n' + longStack.filter(filter).join('\n');
}


function clearData() {
    promiseData = new Map();
    contextStack = [];
    errorStack = [];
}

clearData();

module.exports = {
    enable,
    disable,
    getLongStack,
    pushErrorContext
};

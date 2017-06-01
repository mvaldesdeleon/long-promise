const asyncHooks = require('async_hooks');

const head = array => array.length ? array[array.length - 1] : null;

let promiseData;
let contextStack;
let errorStack;

const LINE_REGEX_A = /^ *at (.+) \((.+):(\d+):(\d+)\)$/;
const LINE_REGEX_B = /^ *at (.+) \(([^:]+)\)$/;
const LINE_REGEX_C = /^ *at (.+):(\d+):(\d+)$/;

const parseLine = line => {
    let match = line.match(LINE_REGEX_A);

    if (match) return {
        fn: match[1],
        file: match[2],
        line: match[3],
        column: match[4]
    };

    match = line.match(LINE_REGEX_B);

    if (match) return {
        fn: match[1],
        file: '',
        line: '',
        column: ''
    };

    match = line.match(LINE_REGEX_C);

    if (match) return {
        fn: 'then',
        file: match[1],
        line: match[2],
        column: match[3]
    };

    return null;
};
const formatLine = line => `    at ${line.fn} (${line.file}:${line.line}:${line.column})`;
const parseStack = stack => stack.split('\n').slice(1).map(parseLine).filter(line => line);
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
    return headline + '\n' + longStack.map(formatLine).filter(filter).join('\n');
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

// eslint-disable-next-line import/no-commonjs
module.exports = {
    'extends': '../.eslintrc.json',

    'globals': {
        'document':           true,
        'performance':        true,
        'assert':             true,
        'beforeAll':          true,
        'afterAll':           true,
        'expect':             true,
        'test':               true,
        'jest':               true,
        'page':               true
    },


    'rules': {
        'compat/compat':         'off',
        'max-lines':             'off',
        'no-restricted-globals': 'off',
        'promise/no-native':     'off'
    }
};

// eslint-disable-next-line import/no-commonjs
module.exports = {
    extends: [ './eslintrc-browser.js' ],
    plugins: [
        'flowtype'
    ],

    rules:   {
        'flowtype/boolean-style':                    [ 'error', 'boolean' ],
        'flowtype/define-flow-type':                 'off',
        'flowtype/delimiter-dangle':                 [ 'error', 'never' ],
        'flowtype/generic-spacing':                  [ 'error', 'never' ],
        'flowtype/no-primitive-constructor-types':   'error',
        'flowtype/no-weak-types':                    [ 'error', { 'any': true, 'Object': false, 'Function': false } ],
        'flowtype/object-type-delimiter':            [ 'error', 'comma' ],
        'flowtype/require-parameter-type':           [ 'off', { 'excludeArrowFunctions': true } ],
        'flowtype/require-return-type':              [ 'error', 'always', { 'annotateUndefined': 'ignore', 'excludeArrowFunctions': true } ],
        'flowtype/require-valid-file-annotation':    [ 'error', 'always', { 'annotationStyle': 'block' } ],
        'flowtype/semi':                             [ 'error', 'always' ],
        'flowtype/space-after-type-colon':           [ 'error', 'always', { 'allowLineBreak': true } ],
        'flowtype/space-before-generic-bracket':     [ 'error', 'never' ],
        'flowtype/space-before-type-colon':          [ 'error', 'always' ],
        'flowtype/type-id-match':                    [ 'off', '^([A-Z][a-z0-9]+)+$' ],
        'flowtype/union-intersection-spacing':       [ 'error', 'always' ],
        'flowtype/use-flow-type':                    'error',
        'flowtype/valid-syntax':                     'error',
        'flowtype/no-dupe-keys':                     'error',
        'flowtype/no-types-missing-file-annotation': 'error',
        'flowtype/require-variable-type':            'off',
        'flowtype/sort-keys':                        'off',
        'flowtype/no-unused-expressions':            'error',
        'flowtype/array-style-complex-type':         'error',
        'flowtype/array-style-simple-type':          'off',
        'flowtype/newline-after-flow-annotation':    'off',
        'flowtype/no-existential-type':              'off',
        'flowtype/no-flow-fix-me-comments':          'off',
        'flowtype/no-mutable-array':                 'error',
        'flowtype/require-exact-type':               'error',
        'flowtype/require-types-at-top':             'off',
        'flowtype/type-import-style':                'off',
        'flowtype/arrow-parens':                     'off',
        'flowtype/no-mixed':                         'off',
        'flowtype/require-compound-type-alias':      'off',
        'flowtype/require-indexer-name':             'off',
        'flowtype/require-inexact-type':             'off',
        'flowtype/require-readonly-react-props':     'off',
        'flowtype/spread-exact-type':                'off'
    }
};

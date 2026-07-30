// ponytail: minimal ESLint config — catches undefined vars and syntax errors only
export default [
  {
    ignores: ['node_modules/', 'frontend/', 'voxengine_ci_source_files/', '*.voxengine.js'],
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      globals: {
        // Node.js globals
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        // Voximplant runtime globals reserved for future .voxengine.js linting
      },
    },
    rules: {
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      'no-cond-assign': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'warn',
      'no-irregular-whitespace': 'error',
      'no-unreachable': 'error',
      'valid-typeof': 'error',
    },
  },
];

// module.exports = {
//     "env": {
//         "browser": true,
//         "es2021": true
//     },
//     "extends": [
//         "eslint:recommended",
//         "plugin:@typescript-eslint/recommended"
//     ],
//     "overrides": [
//         {
//             "env": {
//                 "node": true
//             },
//             "files": [
//                 ".eslintrc.{js,cjs}"
//             ],
//             "parserOptions": {
//                 "sourceType": "script"
//             }
//         }
//     ],
//     "parser": "@typescript-eslint/parser",
//     "parserOptions": {
//         "ecmaVersion": "latest",
//         "sourceType": "module"
//     },
//     "plugins": [
//         "@typescript-eslint"
//     ],
//     "rules": {
//     }
// }

module.exports = {
    "root": true,
    "ignorePatterns": [
      "projects/**/*"
    ],
    "overrides": [
      {
        "files": [
          "*.ts"
        ],
        "parserOptions": {
          "project": [
            "tsconfig.json",
            "e2e/tsconfig.json"
          ],
          "createDefaultProgram": true
        },
        "extends": [
          "plugin:@angular-eslint/ng-cli-compat",
          "plugin:@angular-eslint/ng-cli-compat--formatting-add-on",
          "plugin:@angular-eslint/template/process-inline-templates"
        ],
        "plugins": ["deprecation"],
        "rules": {
          "@angular-eslint/component-selector": [
            "error",
            {
              "type": "element",
              "prefix": "wg",
              "style": "kebab-case"
            }
          ],
          "@angular-eslint/directive-selector": [
            "error",
            {
              "type": "attribute",
              "prefix": "wg",
              "style": "camelCase"
            }
          ],
          "@typescript-eslint/explicit-member-accessibility": [
            "off",
            {
              "accessibility": "explicit"
            }
          ],
          "@typescript-eslint/member-delimiter-style": [
            "error",
            {
              "multiline": {
                "delimiter": "semi",
                "requireLast": true
              },
              "singleline": {
                "delimiter": "comma",
                "requireLast": false
              }
            }
          ],
          "@typescript-eslint/member-ordering": "off",
          "@typescript-eslint/no-explicit-any": "warn",
          "@typescript-eslint/naming-convention": [
            "error",
            {
              "selector": "variable",
              "format": [
                "camelCase",
                "PascalCase",
                "UPPER_CASE"
              ]
            }
          ],
          "@typescript-eslint/no-inferrable-types": [
            "off",
            {
              "ignoreParameters": true,
              "ignoreProperties": true
            }
          ],
          "arrow-body-style": [
            "off",
            "always"
          ],
          "arrow-parens": [
            "off",
            "always"
          ],
          "comma-dangle": "error",
          "import/order": "off",
          "prefer-arrow/prefer-arrow-functions": [
            "off",
            {
              "disallowPrototype": true,
              "singleReturnOnly": false,
              "classPropertiesAllowed": false
            }
          ],
          "no-underscore-dangle": "off",
          "deprecation/deprecation": "warn",
          "keyword-spacing": [2, {"before": true, "after": true}],
          "eqeqeq": ["warn", "always"],
          "no-multi-spaces": ["warn", { "ignoreEOLComments": false }],
          "space-infix-ops": ["warn", { "int32Hint": false }],
          "comma-spacing": ["warn", { "before": false, "after": true }],
          "brace-style": ["warn"],
          "arrow-spacing": ["warn", { "before": true, "after": true }],
          "max-len": ["warn", { "code": 120 }],
          "no-unneeded-ternary": ["warn", { "defaultAssignment": false }],
          "object-property-newline": ["warn", { "allowAllPropertiesOnSameLine": false }],
          "space-before-blocks": "warn",
          "no-unused-vars": ["warn", { "args": "all" }],
          "no-unused-private-class-members": "warn"
        }
      },
      {
        "files": [
          "*.html"
        ],
        "extends": [
          "plugin:@angular-eslint/template/recommended"
        ],
        "rules": {}
      }
    ]
  }

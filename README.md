npm init @open-wc --destinationPath /home/mcpikeda/go/src/github.com/mcdafydd/omw/www --type upgrade --features linting testing demoing building --buildingType rollup --scaffoldFilesFor testing demoing building --tagName x-omw-app --writeToDisk true --installDependencies yarn
{
  "scripts": {
    "lint:eslint": "eslint --ext .js,.html . --ignore-path .gitignore",
    "format:eslint": "eslint --ext .js,.html . --fix --ignore-path .gitignore",
    "lint:prettier": "prettier \"**/*.js\" --check --ignore-path .gitignore",
    "format:prettier": "prettier \"**/*.js\" --write --ignore-path .gitignore",
    "lint": "npm run lint:eslint && npm run lint:prettier",
    "format": "npm run format:eslint && npm run format:prettier",
    "test": "karma start --coverage",
    "test:watch": "karma start --auto-watch=true --single-run=false",
    "test:update-snapshots": "karma start --update-snapshots",
    "test:prune-snapshots": "karma start --prune-snapshots",
    "test:compatibility": "karma start --compatibility all --coverage",
    "test:compatibility:watch": "karma start --compatibility all --auto-watch=true --single-run=false",
    "test:bs": "karma start karma.bs.config.js --compatibility all --coverage",
    "start:build": "cd dist && es-dev-server --open",
    "build": "rimraf dist && rollup -c rollup.config.js"
  },
  "devDependencies": {
    "eslint": "^6.1.0",
    "@open-wc/eslint-config": "^1.0.0",
    "@open-wc/prettier-config": "^0.1.10",
    "husky": "^1.0.0",
    "lint-staged": "^8.0.0",
    "@open-wc/testing-karma": "^3.0.0",
    "webpack-merge": "^4.1.5",
    "@open-wc/testing-karma-bs": "^1.0.0",
    "@open-wc/testing": "^2.0.0",
    "@open-wc/building-rollup": "^0.9.0",
    "rimraf": "^2.6.3",
    "rollup": "^1.15.4"
  },
  "eslintConfig": {
    "extends": [
      "@open-wc/eslint-config",
      "eslint-config-prettier"
    ]
  },
  "prettier": "@open-wc/prettier-config",
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]

/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const glob = require('fast-glob');
const fs = require('fs');
const assert = require('assert');
const chalk = require('chalk');
let path = require('path');
let packages = glob.sync(path.dirname(__dirname) + '/packages/@{react,spectrum}-*/*/package.json');
let errors = false;

// soft assert won't fail the whole thing, allowing us to accumulate all errors at once
// there's probably a nicer way to do this, but well... sometimes it's good enough. feel free to update me :)
// maybe turn me into an actual eslint plugin so we get their format for styling
function softAssert(val, message) {
  try {
    assert(val, message);
  } catch {
    console.error(chalk.red(message));
    errors = true;
  }
}
softAssert.deepEqual = function (val, val2, message) {
  try {
    assert.deepEqual(val, val2, message);
  } catch {
    console.error(chalk.red(message));
    errors = true;
  }
};
softAssert.equal = function (val, val2, message) {
  try {
    assert.strictEqual(val, val2, message);
  } catch {
    console.error(chalk.red(message));
    errors = true;
  }
};

// Checks if a dependency is actually being imported somewhere
function isDepUsed(dep, src) {
  let depRegex = new RegExp(`import .* from '${dep}'`);
  let files = glob.sync(src, {
    ignore: ['**/node_modules/**', '**/dist/**']
  });

  for (let file of files) {
    let contents = fs.readFileSync(file, 'utf8');
    if (depRegex.test(contents)) {
      return true;
    }
  }
  return false;
}

let pkgNames = {};
for (let pkg of packages) {
  let json = JSON.parse(fs.readFileSync(pkg));
  pkgNames[json.name] = true;

  if (!pkg.includes('@react-types') && !pkg.includes('@spectrum-icons')) {
    softAssert(json.main, `${pkg} did not have "main"`);
    softAssert(json.main.endsWith('.js'), `${pkg}#main should be a .js file but got "${json.main}"`);
    softAssert(json.module, `${pkg} did not have "module"`);
    softAssert(json.module.endsWith('.js'), `${pkg}#module should be a .js file but got "${json.module}"`);
    softAssert(json.source, `${pkg} did not have "source"`);
    softAssert.equal(json.source, 'src/index.ts', `${pkg} did not match "src/index.ts"`);
    softAssert.deepEqual(json.files, ['dist', 'src'], `${pkg} did not match "files"`);
    if (pkg.includes('@react-spectrum') || pkg.includes('@react-aria/visually-hidden')) {
      softAssert.deepEqual(json.sideEffects, ['*.css'], `${pkg} is missing sideEffects: [ '*.css' ]`);
    } else {
      softAssert.equal(json.sideEffects, false, `${pkg} is missing sideEffects: false`);
    }
    softAssert(!json.dependencies || !json.dependencies['@adobe/spectrum-css-temp'], `${pkg} has @adobe/spectrum-css-temp in dependencies instead of devDependencies`);
    softAssert(json.dependencies && json.dependencies['@babel/runtime'], `${pkg} is missing a dependency on @babel/runtime`);
    softAssert(!json.dependencies || !json.dependencies['@react-spectrum/test-utils'], '@react-spectrum/test-utils should be a devDependency');
    softAssert(!json.dependencies || !json.dependencies['react'], `${pkg} has react as a dependency, but it should be a peerDependency`);

    if (json.peerDependencies?.react) {
      softAssert.equal(json.peerDependencies.react, '^16.8.0 || ^17.0.0-rc.1 || ^18.0.0', `${pkg} has wrong react peer dep`);
    }

    if (json.peerDependencies?.['react-dom']) {
      softAssert.equal(json.peerDependencies['react-dom'], '^16.8.0 || ^17.0.0-rc.1 || ^18.0.0', `${pkg} has wrong react-dom peer dep`);
    }

    if (json.name.startsWith('@react-spectrum') && json.devDependencies && json.devDependencies['@adobe/spectrum-css-temp']) {
      softAssert.deepEqual(json.targets, {
        main: {
          includeNodeModules: ['@adobe/spectrum-css-temp']
        },
        module: {
          includeNodeModules: ['@adobe/spectrum-css-temp']
        }
      }, `${pkg} did not match "targets"`);
    }

    let topIndexExists = fs.existsSync(path.join(pkg, '..', 'index.ts'));
    if (topIndexExists) {
      let contents = fs.readFileSync(path.join(pkg, '..', 'index.ts'));
      softAssert(/export \* from '.\/src';/.test(contents), `contents of ${path.join(pkg, '..', 'index.ts')} are not "export * from './src';"`);
    }
    softAssert(topIndexExists, `${pkg} is missing an index.ts`);
    softAssert(fs.existsSync(path.join(pkg, '..', 'src', 'index.ts')), `${pkg} is missing a src/index.ts`);
  }

  if (!pkg.includes('@spectrum-icons')) {
    softAssert(json.types, `${pkg} did not have "types"`);
    softAssert(json.types.endsWith('.d.ts'), `${pkg}#types should be a .d.ts file but got "${json.types}"`);
  }

  softAssert(json.publishConfig && json.publishConfig.access === 'public', `${pkg} has missing or incorrect publishConfig`);
  softAssert.equal(json.license, 'Apache-2.0', `${pkg} has an incorrect license`);
  softAssert.deepEqual(json.repository, {type: 'git', url: 'https://github.com/adobe/react-spectrum'}, `${pkg} has incorrect or missing repository url`);

  let readme = path.join(path.dirname(pkg), 'README.md');
  if (!fs.existsSync(readme)) {
    fs.writeFileSync(readme, `# ${json.name}\n\nThis package is part of [react-spectrum](https://github.com/adobe/react-spectrum). See the repo for more details.`);
  }
}


for (let pkg of packages) {
  let globSrc = pkg.replace('package.json', '**/*.{js,ts,tsx}');
  let json = JSON.parse(fs.readFileSync(pkg));
  let [scope, basename] = json.name.split('/');

  if (basename.includes('utils') || basename.includes('layout')) {
    continue;
  }

  let aria = `@react-aria/${basename}`;
  let stately = `@react-stately/${basename}`;
  let types = `@react-types/${basename}`;

  if (scope === '@react-spectrum' && isDepUsed(aria, globSrc)) {
    softAssert(!pkgNames[aria] || json.dependencies[aria], `${pkg} is missing a dependency on ${aria}`);
  }

  if ((scope === '@react-aria' || scope === '@react-spectrum') && isDepUsed(stately, globSrc)) {
    softAssert(!pkgNames[stately] || json.dependencies[stately], `${pkg} is missing a dependency on ${stately}`);
  }

  if ((scope === '@react-aria' || scope === '@react-spectrum' || scope === '@react-stately') && isDepUsed(types, globSrc)) {
    softAssert(!pkgNames[types] || json.dependencies[types], `${pkg} is missing a dependency on ${types}`);
  }
}

if (errors) {
  return process.exit(1);
}

require('./checkPublishedDependencies');
require('./findCircularDeps');

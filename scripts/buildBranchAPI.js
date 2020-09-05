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

const tempy = require('tempy');
const fs = require('fs-extra');
const packageJSON = require('../package.json');
const path = require('path');
const glob = require('fast-glob');
const spawn = require('cross-spawn');

build().catch(err => {
  console.error(err.stack);
  process.exit(1);
});

/**
 * Building this will run the docs builder using the apiCheck pipeline in .parcelrc
 * This will generate json containing the visible (API/exposed) type definitions for each package
 * This is run against the current branch by copying the current branch into a temporary directory and building there
 */
async function build() {
  // Create a temp directory to build the site in
  let dir = tempy.directory();
  console.log(`Building branch api into ${dir}...`);

  // Generate a package.json containing just what we need to build the website
  let pkg = {
    name: 'rsp-website',
    version: '0.0.0',
    private: true,
    workspaces: [
      'packages/*/*'
    ],
    devDependencies: Object.fromEntries(
      Object.entries(packageJSON.devDependencies)
        .filter(([name]) =>
          name.startsWith('@parcel') ||
          name === 'parcel' ||
          name === 'patch-package' ||
          name.startsWith('@spectrum-css') ||
          name.startsWith('@testing-library') ||
          name.startsWith('postcss') ||
          name.startsWith('@adobe')
        )
    ),
    dependencies: {},
    resolutions: packageJSON.resolutions,
    browserslist: packageJSON.browserslist,
    scripts: {
      build: 'yarn parcel build packages/@react-spectrum/actiongroup',
      postinstall: 'patch-package'
    }
  };

  // Add dependencies on each published package to the package.json, and
  // copy the docs from the current package into the temp dir.
  let packagesDir = path.join(__dirname, '..', 'packages');
  let packages = glob.sync('*/**/package.json', {cwd: packagesDir});

  pkg.devDependencies['babel-plugin-transform-glob-import'] = '*';

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, false, 2));

  fs.writeFileSync(path.join(dir, 'babel.config.json'), `{
    "plugins": [
      "transform-glob-import"
    ]
  }`);

  // Copy necessary code and configuration over
  fs.copySync(path.join(__dirname, '..', 'yarn.lock'), path.join(dir, 'yarn.lock'));
  fs.copySync(path.join(__dirname, '..', 'packages', 'dev'), path.join(dir, 'packages', 'dev'));
  fs.copySync(path.join(__dirname, '..', 'packages', '@adobe', 'spectrum-css-temp'), path.join(dir, 'packages', '@adobe', 'spectrum-css-temp'));
  fs.copySync(path.join(__dirname, '..', '.parcelrc'), path.join(dir, '.parcelrc'));
  fs.copySync(path.join(__dirname, '..', 'postcss.config.js'), path.join(dir, 'postcss.config.js'));
  fs.copySync(path.join(__dirname, '..', 'lib'), path.join(dir, 'lib'));
  fs.copySync(path.join(__dirname, '..', 'CONTRIBUTING.md'), path.join(dir, 'CONTRIBUTING.md'));

  // Only copy babel patch over
  let patches = fs.readdirSync(path.join(__dirname, '..', 'patches'));
  let babelPatch = patches.find(name => name.startsWith('@babel'));
  fs.copySync(path.join(__dirname, '..', 'patches', babelPatch), path.join(dir, 'patches', babelPatch));

  let excludeList = ['@react-spectrum/story-utils'];
  // Copy packages over to temp dir
  console.log('copying over');
  for (let p of packages) {
    if (!p.includes('spectrum-css') && !p.includes('dev/')) {
      let json = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'packages', p)), 'utf8');

      if (json.name in excludeList) {
        continue;
      }

      fs.copySync(path.join(__dirname, '..', 'packages', path.dirname(p)), path.join(dir, 'packages', path.dirname(p)), {dereference: true});

      if (!p.includes('@react-types')) {
        delete json.types;
      }
      delete json.main;
      delete json.module;
      delete json.devDependencies;
      json.apiCheck = 'dist/api.json';
      json.targets = {
        apiCheck: {}
      };
      fs.writeFileSync(path.join(dir, 'packages', p), JSON.stringify(json, false, 2));
    }
  }

  // Install dependencies from npm
  await run('yarn', {cwd: dir, stdio: 'inherit'});

  // Build the website
  console.log('building api files');
  await run('yarn', ['parcel', 'build', 'packages/@react-{spectrum,aria,stately}/*/', 'packages/@internationalized/*/', '--target', 'apiCheck'], {cwd: dir, stdio: 'inherit'});

  // Copy the build back into dist, and delete the temp dir.
  fs.copySync(path.join(dir, 'packages'), path.join(__dirname, '..', 'dist', 'branch-api'), {dereference: true});
  fs.removeSync(dir);
}

function run(cmd, args, opts) {
  return new Promise((resolve, reject) => {
    let child = spawn(cmd, args, opts);
    child.on('error', reject);
    child.on('close', code => {
      if (code !== 0) {
        reject(new Error('Child process failed'));
        return;
      }

      resolve();
    });
  });
}

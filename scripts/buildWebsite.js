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
const semver = require('semver');
const spawn = require('cross-spawn');

build().catch(err => {
  console.error(err.stack);
  process.exit(1);
});

async function build() {
  // Create a temp directory to build the site in
  let dir = tempy.directory();
  console.log(`Building into ${dir}...`);

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
          name.startsWith('postcss') ||
          name.startsWith('@adobe') ||
          name === 'sharp'
        )
    ),
    dependencies: {
      '@adobe/react-spectrum': 'latest'
    },
    resolutions: packageJSON.resolutions,
    browserslist: packageJSON.browserslist,
    scripts: {
      build: "DOCS_ENV=production PARCEL_WORKER_BACKEND=process parcel build 'docs/*/*/docs/*.mdx' 'packages/dev/docs/pages/**/*.mdx'",
      postinstall: 'patch-package'
    }
  };

  // Add dependencies on each published package to the package.json, and
  // copy the docs from the current package into the temp dir.
  let packagesDir = path.join(__dirname, '..', 'packages');
  let packages = glob.sync('*/*/package.json', {cwd: packagesDir});
  for (let p of packages) {
    let json = JSON.parse(fs.readFileSync(path.join(packagesDir, p), 'utf8'));
    if (!json.private && json.name !== '@adobe/react-spectrum') {
      let docsDir = path.join(packagesDir, path.dirname(p), 'docs');
      let hasDocs = false;
      if (fs.existsSync(docsDir)) {
        let contents = fs.readdirSync(docsDir);
        for (let file of contents) {
          let docFile = path.join(docsDir, file);
          let destFile = path.join(dir, 'docs', json.name, 'docs', file);
          if (file.endsWith('.mdx')) {
            // Skip mdx files with an after_version key that is <= to the current package version.
            let contents = fs.readFileSync(docFile, 'utf8');
            let m = contents.match(/after_version:\s*(.*)/);
            if (!m || semver.gt(json.version, m[1])) {
              fs.copySync(docFile, destFile);
              hasDocs = true;
            }
          } else {
            fs.copySync(docFile, destFile);
            hasDocs = true;
          }
        }
      }

      if (hasDocs) {
        pkg.dependencies[json.name] = 'latest';
      }
    }
  }

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, false, 2));

  // Copy necessary code and configuration over
  fs.copySync(path.join(__dirname, '..', 'yarn.lock'), path.join(dir, 'yarn.lock'));
  fs.copySync(path.join(__dirname, '..', 'packages', 'dev'), path.join(dir, 'packages', 'dev'));
  fs.removeSync(path.join(dir, 'packages', 'dev', 'v2-test-deps'));
  fs.copySync(path.join(__dirname, '..', 'packages', '@adobe', 'spectrum-css-temp'), path.join(dir, 'packages', '@adobe', 'spectrum-css-temp'));
  fs.copySync(path.join(__dirname, '..', '.parcelrc'), path.join(dir, '.parcelrc'));
  fs.copySync(path.join(__dirname, '..', 'postcss.config.js'), path.join(dir, 'postcss.config.js'));
  fs.copySync(path.join(__dirname, '..', 'lib'), path.join(dir, 'lib'));
  fs.copySync(path.join(__dirname, '..', 'CONTRIBUTING.md'), path.join(dir, 'CONTRIBUTING.md'));

  // Delete mdx files from dev/docs that shouldn't go out yet.
  let devPkg = JSON.parse(fs.readFileSync(path.join(dir, 'packages/dev/docs/package.json'), 'utf8'));
  for (let file of glob.sync('packages/dev/docs/pages/**/*.mdx', {cwd: dir})) {
    let contents = fs.readFileSync(path.join(dir, file), 'utf8');
    let m = contents.match(/after_version:\s*(.*)/);
    if (m && !semver.gt(devPkg.version, m[1])) {
      fs.removeSync(path.join(dir, file));
    }
  }

  // Only copy babel and parcel patches over
  let patches = fs.readdirSync(path.join(__dirname, '..', 'patches')).filter(name => name.startsWith('@babel') || name.startsWith('@parcel'));
  for (let patch of patches) {
    fs.copySync(path.join(__dirname, '..', 'patches', patch), path.join(dir, 'patches', patch));
  }

  // Install dependencies from npm
  await run('yarn', {cwd: dir, stdio: 'inherit'});

  // Copy package.json for each package into docs dir so we can find the correct version numbers
  for (let p of packages) {
    if (fs.existsSync(path.join(dir, 'node_modules', p))) {
      fs.copySync(path.join(dir, 'node_modules', p), path.join(dir, 'docs', p));
    }
  }

  // TEMP HACK: Patch textfield css to workaround parcel bug
  fs.copySync(path.join(dir, 'node_modules', '@react-spectrum', 'label', 'dist', 'main.css'), path.join(dir, 'node_modules', '@react-spectrum', 'textfield', 'dist', 'label.css'));
  let tfpath = path.join(dir, 'node_modules', '@react-spectrum', 'textfield', 'dist', 'module.js');
  let tf = fs.readFileSync(tfpath, 'utf8');
  tf = 'import "./label.css";\n' + tf;
  fs.writeFileSync(tfpath, tf);
  tfpath = path.join(dir, 'node_modules', '@react-spectrum', 'textfield', 'dist', 'main.js');
  tf = fs.readFileSync(tfpath, 'utf8');
  tf = 'require("./label.css");\n' + tf;
  fs.writeFileSync(tfpath, tf);

  // Build the website
  await run('yarn', ['build'], {cwd: dir, stdio: 'inherit'});

  // Copy the build back into dist, and delete the temp dir.
  fs.copySync(path.join(dir, 'dist'), path.join(__dirname, '..', 'dist', 'production', 'docs'));
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

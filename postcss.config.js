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

module.exports = {
  modules: true,
  plugins: require("@spectrum-css/component-builder/css/processors").processors.concat(
    [
      require("postcss-logical")(),
      require("postcss-dir-pseudo-class")(),

      // Use the hover media query in the docs because of SSR - some components have no client JS available.
      // Otherwise, convert :hover to .is-hovered.
      process.env.DOCS_ENV ? require("./lib/postcss-hover-media") : require("./lib/postcss-hover-class"),
    ]
  ),
};

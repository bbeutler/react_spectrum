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

const {Optimizer} = require('@parcel/plugin');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const requireFromString = require('require-from-string');
const {blobToString, urlJoin} = require('@parcel/utils');
const path = require('path');

module.exports = new Optimizer({
  async optimize({bundle, bundleGraph, contents, map}) {
    let mainAsset = bundle.getMainEntry();
    if (!mainAsset || !mainAsset.meta.isMDX) {
      return {contents, map};
    }

    let js = await blobToString(contents);
    let parcelRequireName = Object.keys(global).find(name => name.startsWith('parcelRequire'));
    if (parcelRequireName) {
      delete global[parcelRequireName];
    }
    let Component = requireFromString(js, mainAsset.filePath).default;
    let bundles = bundleGraph.getReferencedBundles(bundle).reverse();

    let pages = [];
    bundleGraph.traverseBundles(b => {
      let mainAsset = b.getMainEntry();
      if (mainAsset && mainAsset.meta.isMDX) {
        let meta = mainAsset.meta;
        pages.push({
          url: urlJoin(b.target.publicUrl, rename(b)),
          name: rename(b),
          title: meta.navigationTitle ?? meta.title,
          category: meta.category,
          description: meta.description,
          keywords: meta.keywords,
          date: meta.date,
          author: meta.author,
          image: getImageURL(meta.image, bundleGraph, b),
          order: meta.order,
          preRelease: meta.preRelease
        });
      }
    }, null);

    let name = rename(bundle);
    let code = ReactDOMServer.renderToStaticMarkup(
      React.createElement(Component, {
        scripts: bundles.filter(b => b.type === 'js').map(b => ({
          type: b.env.outputFormat === 'esmodule' ? 'module' : undefined,
          url: urlJoin(b.target.publicUrl, b.name)
        })),
        styles: bundles.filter(b => b.type === 'css').map(b => ({
          url: urlJoin(b.target.publicUrl, b.name)
        })),
        pages,
        currentPage: {
          category: mainAsset.meta.category,
          name,
          title: mainAsset.meta.title,
          url: urlJoin(bundle.target.publicUrl, name),
          description: mainAsset.meta.description,
          keywords: mainAsset.meta.keywords,
          date: mainAsset.meta.date,
          author: mainAsset.meta.author,
          image: getImageURL(mainAsset.meta.image, bundleGraph, bundle),
          order: mainAsset.meta.order,
          preRelease: mainAsset.meta.preRelease
        },
        toc: mainAsset.meta.toc,
        publicUrl: bundle.target.publicUrl
      })
    );

    return {
      type: 'html',
      contents: '<!doctype html>' + code
    };
  }
});

function rename(bundle) {
  return bundle.name.slice(0, -path.extname(bundle.name).length) + '.html';
}

function getImageURL(image, bundleGraph, bundle) {
  if (!image) {
    return '';
  }

  let dep = bundle.getMainEntry().getDependencies().find(d => d.id === image);
  if (!dep) {
    return '';
  }

  let resolved = bundleGraph.getReferencedBundle(dep, bundle);
  if (!resolved) {
    return '';
  }

  return resolved.name;
}

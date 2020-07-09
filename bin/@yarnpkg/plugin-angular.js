/* eslint-disable */
module.exports = {
name: "@yarnpkg/plugin-angular",
factory: function (require) {
var plugin;plugin=(()=>{"use strict";var e={688:(e,n,o)=>{o.r(n),o.d(n,{default:()=>i});var r=o(966),t=o(773);const s=new Map([[r.structUtils.makeIdent("angular-devkit","build-angular").identHash,"diff --git a/src/angular-cli-files/models/webpack-configs/common.js b/src/angular-cli-files/models/webpack-configs/common.js\nsemver exclusivity >= 0.900.0\n--- a/src/angular-cli-files/models/webpack-configs/common.js\n+++ b/src/angular-cli-files/models/webpack-configs/common.js\n@@ -385,6 +385,9 @@ function getCommonConfig(wco) {\n         devtool: false,\n         profile: buildOptions.statsJson,\n         resolve: {\n+            plugins: [\n+                require('pnp-webpack-plugin'),\n+            ],\n             extensions: ['.ts', '.tsx', '.mjs', '.js'],\n             symlinks: !buildOptions.preserveSymlinks,\n             modules: [wco.tsConfig.options.baseUrl || projectRoot, 'node_modules'],\n@@ -393,6 +396,9 @@ function getCommonConfig(wco) {\n         resolveLoader: {\n             symlinks: !buildOptions.preserveSymlinks,\n             modules: loaderNodeModules,\n+            plugins: [\n+                require('pnp-webpack-plugin').moduleLoader(module),\n+            ],\n         },\n         context: projectRoot,\n         entry: entryPoints,\ndiff --git a/src/angular-cli-files/models/webpack-configs/common.js b/src/angular-cli-files/models/webpack-configs/common.js\nsemver exclusivity > 0.803.0 < 0.900.0\n--- a/src/angular-cli-files/models/webpack-configs/common.js\n+++ b/src/angular-cli-files/models/webpack-configs/common.js\n@@ -32,10 +32,7 @@ function getCommonConfig(wco) {\n     const { root, projectRoot, buildOptions, tsConfig } = wco;\n     const { styles: stylesOptimization, scripts: scriptsOptimization } = buildOptions.optimization;\n     const { styles: stylesSourceMap, scripts: scriptsSourceMap, vendor: vendorSourceMap, } = buildOptions.sourceMap;\n-    const nodeModules = find_up_1.findUp('node_modules', projectRoot);\n-    if (!nodeModules) {\n-        throw new Error('Cannot locate node_modules directory.');\n-    }\n+    const nodeModules = undefined;\n     // tslint:disable-next-line:no-any\n     const extraPlugins = [];\n     const entryPoints = {};\n@@ -327,6 +324,9 @@ function getCommonConfig(wco) {\n         devtool: false,\n         profile: buildOptions.statsJson,\n         resolve: {\n+            plugins: [\n+                require('pnp-webpack-plugin'),\n+            ],\n             extensions: ['.ts', '.tsx', '.mjs', '.js'],\n             symlinks: !buildOptions.preserveSymlinks,\n             modules: [wco.tsConfig.options.baseUrl || projectRoot, 'node_modules'],\n@@ -334,6 +334,9 @@ function getCommonConfig(wco) {\n         },\n         resolveLoader: {\n             modules: loaderNodeModules,\n+            plugins: [\n+                require('pnp-webpack-plugin').moduleLoader(module),\n+            ],\n         },\n         context: projectRoot,\n         entry: entryPoints,\ndiff --git a/src/protractor/index.js b/src/protractor/index.js\nsemver exclusivity < 0.900.0\n--- a/src/protractor/index.js\n+++ b/src/protractor/index.js\n@@ -27,21 +27,14 @@ function runProtractor(root, options) {\n async function updateWebdriver() {\n     // The webdriver-manager update command can only be accessed via a deep import.\n     const webdriverDeepImport = 'webdriver-manager/built/lib/cmds/update';\n-    const importOptions = [\n-        // When using npm, webdriver is within protractor/node_modules.\n-        `protractor/node_modules/${webdriverDeepImport}`,\n-        // When using yarn, webdriver is found as a root module.\n-        webdriverDeepImport,\n-    ];\n     let path;\n-    for (const importOption of importOptions) {\n-        try {\n-            path = require.resolve(importOption);\n-        }\n-        catch (error) {\n-            if (error.code !== 'MODULE_NOT_FOUND') {\n-                throw error;\n-            }\n+    try {\n+        const protractorPath = require.resolve('protractor');\n+        path = require.resolve(webdriverDeepImport, { paths: [protractorPath] });\n+    }\n+    catch (error) {\n+        if (error.code !== 'MODULE_NOT_FOUND') {\n+            throw error;\n         }\n     }\n     if (!path) {\n"],[r.structUtils.makeIdent("angular-devkit","core").identHash,"diff --git a/node/resolve.js b/node/resolve.js\nindex 41c5a81..77cfbe4 100644\nsemver exclusivity >=8.3.13\n--- a/node/resolve.js\n+++ b/node/resolve.js\n@@ -66,7 +66,81 @@ function _getGlobalNodeModules() {\n         ? path.resolve(globalPrefix || '', 'lib', 'node_modules')\n         : path.resolve(globalPrefix || '', 'node_modules');\n }\n-let _resolveHook = null;\n+const pnpapi = require('pnpapi');\n+let _resolveHook =\n+    /**\n+     *\n+     * @param {string} request\n+     * @param {{paths?: string[]; checkLocal?: boolean; basedir: string}} options\n+     */\n+    function resolveHook(request, options) {\n+      const basePath = options.basedir;\n+\n+      if (/^(?:\\.\\.?(?:\\/|$)|\\/|([A-Za-z]:)?[/\\\\])/.test(request)) {\n+        let res = path.resolve(basePath, request);\n+        if (request === '..' || request.endsWith('/')) {\n+          res += '/';\n+        }\n+\n+        const m = resolve(res, options);\n+        if (m) {\n+          return m;\n+        }\n+      } else {\n+        const n = resolve(request, options);\n+        if (n) {\n+          return n;\n+        }\n+      }\n+\n+      if (options.checkLocal) {\n+        const callers = _caller();\n+        for (const caller of callers) {\n+          const localDir = path.dirname(caller);\n+          if (localDir !== options.basedir) {\n+            try {\n+              return resolveHook(request, {\n+                ...options,\n+                checkLocal: false,\n+                basedir: localDir,\n+              });\n+            } catch (e) {\n+              // Just swap the basePath with the original call one.\n+              if (!(e instanceof ModuleNotFoundException)) {\n+                throw e;\n+              }\n+            }\n+          }\n+        }\n+      }\n+\n+      throw new ModuleNotFoundException(request, basePath);\n+\n+      function resolve(request, options) {\n+        const issuer = path.join(options.basedir, 'synthetic.file');\n+        if (options.resolvePackageJson) {\n+          try {\n+            return pnpapi.resolveRequest(path.join(request, 'package.json'), issuer);\n+          } catch (_) {\n+            // ignore\n+          }\n+        }\n+\n+        if (request.endsWith('/')) {\n+          try {\n+            return pnpapi.resolveRequest(path.join(request, 'index'), issuer);\n+          } catch (_) {\n+            // ignore\n+          }\n+        } else {\n+          try {\n+            return pnpapi.resolveRequest(request, issuer);\n+          } catch (_) {\n+            // ignore\n+          }\n+        }\n+      }\n+    };\n /** @deprecated since version 8. Use `require.resolve` instead. */\n function setResolveHook(hook) {\n     _resolveHook = hook;\n"],[r.structUtils.makeIdent("angular","cli").identHash,"diff --git a/commands/version-impl.js b/commands/version-impl.js\n--- a/commands/version-impl.js\n+++ b/commands/version-impl.js\n@@ -45,7 +45,7 @@ class VersionCommand extends command_1.Command {\n             ...Object.keys((projPkg && projPkg['dependencies']) || {}),\n             ...Object.keys((projPkg && projPkg['devDependencies']) || {}),\n         ];\n-        if (packageRoot != null) {\n+        if (false && packageRoot != null) {\n             // Add all node_modules and node_modules/@*/*\n             const nodePackageNames = fs.readdirSync(packageRoot).reduce((acc, name) => {\n                 if (name.startsWith('@')) {\n@@ -63,7 +63,15 @@ class VersionCommand extends command_1.Command {\n             if (name in acc) {\n                 return acc;\n             }\n-            acc[name] = this.getVersion(name, packageRoot, maybeNodeModules);\n+            try {\n+                acc[name] = require(require.resolve(`${name}/package.json`, {paths: [this.workspace.root]})).version;\n+            } catch (_) {\n+                try {\n+                    acc[name] = require(`${name}/package.json`).version + ' (cli-only)';\n+                } catch (_) {\n+                    acc[name] = '<error>';\n+                }\n+            }\n             return acc;\n         }, {});\n         let ngCliVersion = pkg.version;\n"]]),i={hooks:{setupScriptEnvironment:async(e,n,o)=>{const s=e.topLevelWorkspace.dependencies.get(r.structUtils.makeIdent("angular","cli").identHash);if(!s)return;const i=e.storedResolutions.get(s.descriptorHash);if(!i)throw new Error("Couldn't find resolution for @angular/cli");const a=e.storedPackages.get(i);if(!a)throw new Error(`Assertion failed: The package (${i}) should have been registered`);const c=e.configuration.getLinkers().find(n=>n.supportsPackage(a,{project:e}));if(!c)throw new Error(`Assertion failed: The package (${i}) should have been linked`);const l=await c.findPackageLocation(a,{project:e,report:new r.ThrowReport});for(const[e,n]of a.bin)await o(e,process.execPath,[t.npath.fromPortablePath(t.ppath.resolve(l,n))])},registerPackageExtensions:async(e,n)=>{n(r.structUtils.makeDescriptor(r.structUtils.makeIdent("angular-devkit","build-angular"),"*"),{dependencies:{"pnp-webpack-plugin":"^1.6.0"},peerDependencies:{karma:"~4.4.1",protractor:"~5.4.3"},peerDependenciesMeta:{karma:{optional:!0},protractor:{optional:!0}}}),n(r.structUtils.makeDescriptor(r.structUtils.makeIdent(null,"protractor"),"*"),{dependenciesMeta:{"webdriver-manager":{unplugged:!0}}})},getBuiltinPatch:async(e,n)=>{if(n.startsWith("ng/"))return s.get(r.structUtils.parseIdent(n.slice("ng/".length)).identHash)||null},reduceDependency:async e=>null==s.get(e.identHash)?e:r.structUtils.makeDescriptor(e,r.structUtils.makeRange({protocol:"patch:",source:r.structUtils.stringifyDescriptor(e),selector:`builtin<ng/${r.structUtils.stringifyIdent(e)}>`,params:null}))}}},966:e=>{e.exports=require("@yarnpkg/core")},773:e=>{e.exports=require("@yarnpkg/fslib")}},n={};function o(r){if(n[r])return n[r].exports;var t=n[r]={exports:{}};return e[r](t,t.exports,o),t.exports}return o.d=(e,n)=>{for(var r in n)o.o(n,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},o.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o(688)})();
return plugin;
}
};
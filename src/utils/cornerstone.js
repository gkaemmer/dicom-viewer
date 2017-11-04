import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import $ from "jquery";
window.$ = $;

try {
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    webWorkerPath: "/static/cornerstoneWADOImageLoaderWebWorker.min.js",
    taskConfiguration: {
      decodeTask: {
        codecsPath: "/static/cornerstoneWADOImageLoaderCodecs.min.js"
      }
    }
  });
} catch (e) {
  // Already initialized
}

export { cornerstone, cornerstoneTools, cornerstoneWADOImageLoader };

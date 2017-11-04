import React, { Component } from "react";
import throttle from "lodash/throttle";
import * as dicomParser from "dicom-parser";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as wadoImageLoader from "cornerstone-wado-image-loader";
import $ from "jquery";
window.$ = $;

try {
  wadoImageLoader.webWorkerManager.initialize({
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

export default class DicomViewer extends Component {
  state = {
    seriesIndex: 0,
    imageIndex: 0
  };

  scrollImages = throttle(
    deltaY => {
      if (deltaY < 0) this.prevImage();
      else this.nextImage();
    },
    100,
    { trailing: false }
  );

  toImageId(image) {
    if (!image._fileLoaderIndex) {
      const file = this.props.dicomdir.filesById[image.id];
      const index = wadoImageLoader.wadouri.fileManager.add(file);
      image._fileLoaderIndex = index;
    }
    return image._fileLoaderIndex;
  }

  loadImage() {
    if (this.images.length === 0) return;
    const imageIndex = this.state.imageIndex;
    const imageId = this.toImageId(this.images[imageIndex]);
    this.setState({ isLoading: true });

    try {
      cornerstone.loadImage(imageId).then(
        image => {
          if (!this.isInitialized) this.initCornerstone();
          const viewport = cornerstone.getDefaultViewportForImage(
            this.div,
            image
          );
          // Only display image if it is the last one to be loaded
          if (this.state.imageIndex === imageIndex) {
            cornerstone.displayImage(this.div, image, viewport);
            this.setState({ isLoading: false });
          }
        },
        e => console.error("Something wicked happened", e)
      );
    } catch (e) {
      console.error("Caught ze error", e);
    }
  }

  handleWheel = e => {
    e.preventDefault();
    if (!this.isInitialized) return;
    this.scrollImages(e.deltaY);
  };

  nextImage() {
    if (this.state.imageIndex >= this.images.length - 1) return;
    this.setState({ imageIndex: this.state.imageIndex + 1 }, () => {
      this.loadImage();
    });
  }

  prevImage() {
    if (this.state.imageIndex < 1) return;
    this.setState({ imageIndex: this.state.imageIndex - 1 }, () => {
      this.loadImage();
    });
  }

  setSeries(index) {
    this.setState({ seriesIndex: index, imageIndex: 0 }, () => {
      this.loadImage();
    });
  }

  initCornerstone() {
    cornerstone.enable(this.div);
    cornerstoneTools.mouseInput.enable(this.div);
    cornerstoneTools.mouseWheelInput.enable(this.div);
    cornerstoneTools.wwwc.activate(this.div, 1); // ww/wc is the default tool for left mouse button
    cornerstoneTools.pan.activate(this.div, 2); // pan is the default tool for middle mouse button
    cornerstoneTools.zoom.activate(this.div, 4); // zoom is the default tool for right mouse button
    this.isInitialized = true;
  }

  componentDidMount() {
    this.loadImage();
  }

  get images() {
    return this.series.images;
  }

  get series() {
    return this.props.dicomdir.series[this.state.seriesIndex];
  }

  render() {
    return (
      <div>
        {this.props.dicomdir.series.map((series, i) => (
          <div onClick={() => this.setSeries(i)}>Series {i + 1}</div>
        ))}
        <div
          ref={div => (this.div = div)}
          style={{ width: 300, height: 300 }}
          onWheel={this.handleWheel}
        />
      </div>
    );
  }
}

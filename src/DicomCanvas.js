import React, { Component } from "react";
import throttle from "lodash/throttle";
import {
  cornerstone,
  cornerstoneTools,
  cornerstoneWADOImageLoader
} from "./utils/cornerstone";

export default class DicomViewer extends Component {
  state = {
    isLoading: false
  };

  toImageId(image) {
    if (!image._fileLoaderIndex) {
      const file = this.props.dicomdir.filesById[image.id];
      const index = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      image._fileLoaderIndex = index;
    }
    return image._fileLoaderIndex;
  }

  loadImage() {
    if (this.images.length === 0) return;
    const imageIndex = this.props.imageIndex;
    const imageId = this.toImageId(this.images[imageIndex]);
    this.setState({ isLoading: true });

    cornerstone.loadImage(imageId).then(
      image => {
        if (!this.isInitialized) this.initCornerstone();
        const viewport = cornerstone.getDefaultViewportForImage(
          this.div,
          image
        );
        // Only display image if it is the last one to be loaded
        if (this.props.imageIndex === imageIndex) {
          cornerstone.displayImage(this.div, image, viewport);
          this.setState({ isLoading: false });
        }
      },
      e => console.error(e)
    );
  }

  initCornerstone() {
    cornerstone.enable(this.div);
    cornerstoneTools.mouseInput.enable(this.div);
    cornerstoneTools.mouseWheelInput.enable(this.div);
    cornerstoneTools.wwwc.activate(this.div, 1); // ww/wc is the default tool for left mouse button
    cornerstoneTools.pan.activate(this.div, 2); // pan is the default tool for middle mouse button
    cornerstoneTools.zoom.activate(this.div, 4); // zoom is the default tool for right mouse button
    this.isInitialized = true;
    if (this.props.onInitialized) this.props.onInitialized();
  }

  componentDidMount() {
    this.loadImage();
  }

  get images() {
    return this.series.images;
  }

  get series() {
    return this.props.dicomdir.series[this.props.seriesIndex];
  }

  componentDidUpdate(oldProps) {
    if (
      oldProps.seriesIndex !== this.props.seriesIndex ||
      oldProps.imageIndex !== this.props.imageIndex
    )
      this.loadImage();
  }

  render() {
    const {
      dicomdir,
      imageIndex,
      seriesIndex,
      onInitialized,
      height,
      ...rest
    } = this.props;
    return (
      <div style={{ width: "100%" }} {...rest}>
        <div
          ref={div => (this.div = div)}
          onContextMenu={e => e.preventDefault()}
          unselectable="on"
          style={{ width: height, height: height, margin: "0 auto" }}
        />
      </div>
    );
  }
}

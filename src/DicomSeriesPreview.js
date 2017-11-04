import React, { Component } from "react";
import {
  cornerstone,
  cornerstoneTools,
  cornerstoneWADOImageLoader
} from "./utils/cornerstone";

export default class DicomSeriesPreview extends Component {
  toImageId(image) {
    if (!image._fileLoaderIndex) {
      const file = this.props.dicomdir.filesById[image.id];
      const index = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      image._fileLoaderIndex = index;
    }
    return image._fileLoaderIndex;
  }

  componentDidMount() {
    const imageId = this.toImageId(
      this.props.dicomdir.series[this.props.seriesIndex].images[0]
    );
    cornerstone.enable(this.div);
    cornerstone.loadImage(imageId).then(image => {
      const viewport = cornerstone.getDefaultViewportForImage(this.div, image);
      cornerstone.displayImage(this.div, image, viewport);
    });
  }

  render() {
    return (
      <div className="series-preview-container" onClick={this.props.onClick}>
        <div style={{ height: 96, width: 96 }} ref={div => (this.div = div)} />
        <style jsx>{`
          .series-preview-container {
            width: 100px;
            height: 100px;
            border: 2px solid ${this.props.isSelected ? "#aaa" : "#000"};
            margin: 0 10px;
          }
        `}</style>
      </div>
    );
  }
}

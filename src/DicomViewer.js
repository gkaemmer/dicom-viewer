import React, { Component } from "react";
import throttle from "lodash/throttle";
import DicomCanvas from "./DicomCanvas";
import DicomSeriesPreview from "./DicomSeriesPreview";

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

  handleWheel = e => {
    e.preventDefault();
    if (!this.isInitialized) return;
    this.scrollImages(e.deltaY);
  };

  nextImage() {
    if (this.state.imageIndex >= this.images.length - 1) return;
    this.setState({ imageIndex: this.state.imageIndex + 1 });
  }

  prevImage() {
    if (this.state.imageIndex < 1) return;
    this.setState({ imageIndex: this.state.imageIndex - 1 });
  }

  setSeries(index) {
    this.setState({ seriesIndex: index, imageIndex: 0 });
  }

  get images() {
    return this.series.images;
  }

  get series() {
    return this.props.dicomdir.series[this.state.seriesIndex];
  }

  componentWillMount() {
    // Size the viewer properly
    this.setState({ height: window.innerHeight - 100 });
  }

  render() {
    return (
      <div className="container">
        <style jsx>{`
          .container {
            background-color: black;
          }

          .series-previews {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: horizontal;
          }

          .canvas-container {
            height: ${this.state.height}px;
            display: flex;
            flex-direction: vertical;
          }

          .canvas-container > div {
            flex: 1;
            width: 100%;
          }
        `}</style>
        <div className="series-previews">
          {this.props.dicomdir.series.map((series, i) => (
            <DicomSeriesPreview
              key={i}
              dicomdir={this.props.dicomdir}
              seriesIndex={i}
              onClick={() => this.setSeries(i)}
              isSelected={this.state.seriesIndex === i}
            />
          ))}
        </div>
        <div className="canvas-container">
          <DicomCanvas
            dicomdir={this.props.dicomdir}
            imageIndex={this.state.imageIndex}
            seriesIndex={this.state.seriesIndex}
            onWheel={this.handleWheel}
            height={this.state.height}
            onInitialized={() => (this.isInitialized = true)}
          />
        </div>
      </div>
    );
  }
}

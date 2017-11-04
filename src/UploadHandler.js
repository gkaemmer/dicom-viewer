import React from "react";
import { fromFileTree } from "./utils/Dicomdir";
import parseFileTree from "./utils/parseFileTree";

export default class UploadHandler extends React.Component {
  state = {
    isHovering: false
  };

  hoverCounter = 0;

  componentDidMount() {
    this.addEventListeners();
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  addEventListeners() {
    console.log("addEventListeners");
    if (window.__dragEventsSet) return;
    window.addEventListener("dragstart", this.handleDragStart);
    window.addEventListener("dragenter", this.handleEnter);
    window.addEventListener("dragleave", this.handleLeave);
    window.addEventListener("dragover", this.handleDragOver);
    window.addEventListener("drop", this.handleFileDrop);
    window.__dragEventsSet = true;
  }

  removeEventListeners() {
    console.log("removeEventListeners");
    if (!window.__dragEventsSet) return;
    window.removeEventListener("dragstart", this.handleDragStart);
    window.removeEventListener("dragenter", this.handleEnter);
    window.removeEventListener("dragleave", this.handleLeave);
    window.removeEventListener("dragover", this.handleDragOver);
    window.removeEventListener("drop", this.handleFileDrop);
    window.__dragEventsSet = false;
  }

  componentDidMount() {
    this.addEventListeners();
  }

  componentWillUnmount() {
    this.removeEventListeners();
    this.filesByName = null;
  }

  handleEnter = e => {
    this.hoverCounter++;
    e.preventDefault();
    this.setState({ isHovering: true });
  };

  handleLeave = e => {
    e.preventDefault();
    this.hoverCounter--;
    if (this.hoverCounter === 0) {
      this.setState({ isHovering: false });
    }
  };

  handleDragStart = e => {
    e.preventDefault();
  };

  handleDragOver = e => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  };

  handleFileDrop = async e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isHovering: false });

    if (this.props.onDrop) this.props.onDrop();

    let dicomdir;

    try {
      let dicomdirFile = undefined;
      let dicompath = undefined;

      const filesByName = await parseFileTree(e, {
        handleFile: (file, path) => {
          if (file.name === "DICOMDIR") {
            dicomdirFile = file;
            dicompath = path;
          }
        }
      });

      if (!dicomdirFile) throw new Error("Doesn't look like a DICOM CD");

      dicomdir = await fromFileTree(filesByName, dicomdirFile, dicompath);
    } catch (e) {
      if (this.props.onError) this.props.onError(e);
    }

    if (dicomdir && this.props.onDicomdir) this.props.onDicomdir(dicomdir);
  };

  render() {
    return (
      <div>
        <style jsx>{`
          div.droparea {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: border 0.2s, background-color 0.2s;
            background-color: ${this.state.isHovering
              ? "rgba(255, 255, 255, 0.1)"
              : "transparent"};
            border: 2px dashed rgba(255, 255, 255, 0.3);
            border-radius: 10px;
          }
          span {
            font-size: 24px;
            color: #ccc;
          }
        `}</style>
        {(this.props.showPrompt || this.state.isHovering) && (
          <div className="droparea">
            <span>
              {this.state.isHovering ? (
                "Drop anywhere!"
              ) : (
                "Drag the whole contents of a DICOM CD here"
              )}
            </span>
          </div>
        )}
      </div>
    );
  }
}

import UploadHandler from "../src/UploadHandler";
import dynamic from "next/dynamic";

const DicomViewer = dynamic(import("../src/DicomViewer"));

export default class Index extends React.Component {
  state = {
    hasDicomdir: false
  };

  setDicomdir(dicomdir) {
    this.dicomdir = dicomdir;
    this.setState({ hasDicomdir: true });
  }

  render() {
    return (
      <div>
        Welcome to the viewer
        {this.state.hasDicomdir ? (
          <DicomViewer dicomdir={this.dicomdir} />
        ) : (
          <UploadHandler
            onDicomdir={dicomdir => {
              this.setDicomdir(dicomdir);
            }}
          />
        )}
      </div>
    );
  }
}

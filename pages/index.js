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
        <style jsx global>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
              "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
              "Helvetica Neue", sans-serif;
            margin: 0;
          }
          * {
            box-sizing: border-box;
          }
        `}</style>
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

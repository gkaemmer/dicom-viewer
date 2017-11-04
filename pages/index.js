import UploadHandler from "../src/UploadHandler";
import dynamic from "next/dynamic";
import Head from "next/head";

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
        <Head>
          <title>Online DICOM CD Viewer</title>
        </Head>
        <style jsx global>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
              "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
              "Helvetica Neue", sans-serif;
            margin: 0;
            background-color: #000;
          }
          * {
            box-sizing: border-box;
          }
        `}</style>
        {this.state.hasDicomdir && <DicomViewer dicomdir={this.dicomdir} />}

        <UploadHandler
          showPrompt={!this.state.hasDicomdir}
          onDicomdir={dicomdir => {
            this.setDicomdir(dicomdir);
          }}
        />
      </div>
    );
  }
}

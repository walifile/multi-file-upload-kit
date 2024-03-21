import { useState, useRef } from "react";
import "./styles/global.css";

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const acceptedFileExtensions = ["jpg", "png", "jpeg"];

  const acceptedFileTypesString = acceptedFileExtensions
    .map((ext) => `.${ext}`)
    .join(",");

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      setError("File is required");
    } else if (!error) {
      setSelectedFiles([]);
      setError("");
    }
  };

  const handleFileChange = (event) => {
    const newFilesArray = Array.from(event.target.files);
    processFiles(newFilesArray);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const processFiles = (filesArray) => {
    const newSelectedFiles = [...selectedFiles];
    let hasError = false;
    const fileTypeRegex = new RegExp(acceptedFileExtensions.join("|"), "i");
    console.log(fileTypeRegex, "fileTypeRegex");
    filesArray.forEach((file) => {
      if (newSelectedFiles.some((f) => f.name === file.name)) {
        setError("File names must be unique");
        hasError = true;
      } else if (!fileTypeRegex.test(file.name.split(".").pop())) {
        setError(`Only ${acceptedFileExtensions.join(", ")} files are allowed`);
        hasError = true;
      } else {
        newSelectedFiles.push(file);
      }
    });

    if (!hasError) {
      setError("");
      setSelectedFiles(newSelectedFiles);
    }
  };

  const handleCustomButtonClick = () => {
    // Trigger the click event of the hidden file input
    fileInputRef.current.click();
  };

  const handleFileDelete = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Upload Files
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="min-h-[23rem] border-4 border-dashed border-blue-500 bg-blue-100 rounded-3xl p-4 flex flex-col justify-center items-center space-y-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e)}
          >
            <img
              src="/assets/svg/upload.svg"
              alt="Upload Icon"
              className="w-24 h-24 mb-2"
            />
            <p className="text-lg font-semibold">Drag and Drop the files</p>
            <p className="text-lg font-bold">or</p>
            <button
              type="button"
              onClick={handleCustomButtonClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Upload Files
            </button>
            <input
              type="file"
              id="files"
              name="files"
              multiple
              accept={acceptedFileTypesString}
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              onClick={(event) => {
                // Reset the input value to allow selecting the same file again
                event.target.value = null;
              }}
            />
          </div>

          <div className="border-2 border-gray-300 rounded-3xl py-4 max-h-[23rem] overflow-auto">
            {selectedFiles.length > 0 ? (
              <ul className="px-4">
                {selectedFiles.map((file, index) => (
                  <li
                    key={file.name}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <div className="flex items-center">
                      <img
                        src="/assets/svg/image.svg"
                        alt="File Icon"
                        className="w-8 h-8 mr-2"
                      />
                      <span className="text-base">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFileDelete(index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="none"
                        class="w-6 h-6"
                      >
                        <path
                          stroke="currentColor"
                          stroke-width="2"
                          d="M6 4l8 8M14 4l-8 8"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full flex justify-center items-center">
                <p className="text-lg font-semibold text-gray-500 text-center">
                  No Files Uploaded Yet
                </p>
              </div>
            )}
          </div>
        </div>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

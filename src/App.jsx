import { useState, useRef } from "react";
import "./styles/global.css";

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const acceptedFileExtensions = ["stl", "zip", "rar", "png"];

  const acceptedFileTypesString = acceptedFileExtensions
    .map((ext) => `.${ext}`)
    .join(",");

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      setError("File is required");
    } else if (!error) {
      onFilesChange([...selectedFiles]);
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
    <>
      <div className="border mt-2 border-neutral-300 rounded-xl shadow-md bg-white text-sm p-5 w-2/3 absolute z-20 text-primary-label">
        <div>
          <div className="mt-5 mb-3 flex justify-center">
            {/* <CaseHeading heading="Please Upload Files" /> */}
            Please Upload Files
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="min-h-[23rem]
                 border-3 border-dashed border-[#0284C7] bg-[#F0F9FF] rounded-3xl p-4 flex flex-col justify-center items-center space-y-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e)}
              >
                <img
                  src="/assets/images/49.svg"
                  alt="image"
                  width={90}
                  height={90}
                />

                <p className="text-lg font-semibold">Drag and Drop the files</p>
                <p className="text-lg font-bold">or</p>

                <button type="button" onClick={handleCustomButtonClick}>
                  Upload Files
                </button>

                <input
                  type="file"
                  id="files"
                  name="files"
                  multiple
                  accept={acceptedFileTypesString}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onClick={(event) => {
                    // Reset the input value to allow selecting the same file again
                    event.target.value = null;
                  }}
                  onChange={handleFileChange}
                  className="form-control"
                />
              </div>

              <div
                className={`rounded-3xl border-2 border-[#A3A3A3] py-4 max-h-[23rem]`}
              >
                <div className="h-full overflow-auto  py-2 px-5">
                  {selectedFiles.length > 0 ? (
                    <ul>
                      {selectedFiles?.map((file, index) => (
                        <div
                          className="flex justify-between items-center"
                          key={file.name}
                        >
                          <div className="flex items-center pb-2">
                            <img
                              src="/assets/images/50.svg"
                              width={40}
                              height={40}
                              alt="icon"
                            />
                            <span
                              className="text-lg underline ps-4"
                              title={file.name}
                            >
                              {file.name}
                            </span>
                          </div>
                          <div>
                            CloseIcon
                            {/* <CloseIcon
                              color="#444444"
                              onClick={() => handleFileDelete(index)}
                            /> */}
                          </div>
                        </div>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-lg font-semibold  text-[#A3A3A3] h-full flex items-center justify-center">
                      No Files Uploaded Yet
                    </p>
                  )}
                </div>
                {error && (
                  <div style={{ color: "red" }} className={`pt-5 pl-2 `}>
                    {error}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button type="submit" onClick={handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

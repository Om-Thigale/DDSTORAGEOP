import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        // Fetch API keys from environment variables for security
        const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
        const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;

        // Upload file to Pinata IPFS
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        // Call the contract function to store the file hash
        await contract.add(account, ImgHash);
        alert("Image successfully uploaded to Pinata and stored on the blockchain!");

        // Reset file input
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        console.error("Error uploading image:", e);
        alert("Unable to upload image to Pinata");
      }
    }
  };

  // Handle file selection and reading
  const retrieveFile = (e) => {
    const data = e.target.files[0];
    if (data) {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(data);
      reader.onloadend = () => {
        setFile(e.target.files[0]);
      };
      setFileName(e.target.files[0].name);
    }
    e.preventDefault();
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload File to Pinata
        </button>
      </form>
    </div>
  );
};

export default FileUpload;

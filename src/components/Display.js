import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  
  const getData = async () => {
    let dataArray;
    const otherAddress = document.querySelector(".address").value; // Fetching user input

    try {
      if (otherAddress) {
        dataArray = await contract.display(otherAddress); // Fetch data for other address
      } else {
        dataArray = await contract.display(account); // Fetch data for connected account
      }
    } catch (e) {
      alert("You don't have access"); // Show an error if access is denied
      return;
    }

    if (dataArray && dataArray.length > 0) { // Check if data exists
      const images = dataArray.map((item, i) => (
        <a href={item} key={i} target="_blank" rel="noopener noreferrer">
          <img
            src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`} 
            alt="Uploaded content"
            className="image-list"
          />
        </a>
      ));
      setData(images); // Display images from IPFS links
    } else {
      alert("No image to display");
    }
  };

  return (
    <>
      <div className="image-list">{data}</div>
      <input
        type="text"
        placeholder="Enter Account Address to Get Data"
        className="address"
      />
      <button className="center button" onClick={getData}>
        Get Data of this Account
      </button>
    </>
  );
};

export default Display;

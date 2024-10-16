import { useEffect } from "react";
import "./Modal.css";

const Modal = ({ setModalOpen, contract }) => {
  const sharing = async () => {
    const address = document.querySelector(".address").value;
    if (contract) {
      try {
        await contract.allow(address); // Allow access to the provided address
        setModalOpen(false); // Close the modal after sharing
      } catch (error) {
        console.error("Error sharing access:", error);
      }
    }
  };

  useEffect(() => {
    const accessList = async () => {
      if (contract) {
        try {
          const addressList = await contract.shareAccess(); // Get the access list
          let select = document.querySelector("#selectNumber");
          const options = addressList.map((item) => `${item.user} - ${item.access ? "Allowed" : "Disallowed"}`);

          for (let i = 0; i < options.length; i++) {
            let opt = options[i];
            let e1 = document.createElement("option");
            e1.textContent = opt;
            e1.value = opt;
            select.appendChild(e1); // Add addresses to the dropdown list
          }
        } catch (error) {
          console.error("Error fetching access list:", error);
        }
      }
    };
    contract && accessList();
  }, [contract]);

  return (
    <>
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="title">Share with</div>
          <div className="body">
            <input
              type="text"
              className="address"
              placeholder="Enter Address"
            ></input>
          </div>
          <form id="myForm">
            <select id="selectNumber">
              <option className="address">People With Access</option>
            </select>
          </form>
          <div className="footer">
            <button
              onClick={() => {
                setModalOpen(false);
              }}
              id="cancelBtn"
            >
              Cancel
            </button>
            <button onClick={() => sharing()}>Share</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import axios from "axios"; // Import axios for API requests
import { XCircleIcon } from "@heroicons/react/24/solid";


const ActionModal = ({ closeModal, itemCode, action, setItems, items, setFilteredItems }) => {
  const [item, setItem] = useState(null);
  const [qty, setQty] = useState("");
  const [selectedUOM, setSelectedUOM] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [expDate, setExpDate] = useState("");
  const [purchasedDate, setPurchasedDate] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");



  const uoms = [
    { display: "Kilograms", value: "KG" },
    { display: "Liters", value: "LTR" },
    { display: "Units", value: "UNITS" },
  ];

  const types = [
    "Food",
    "Dairy",
    "Personal Care",
    "Beverages",
    "Clothing",
    "Electronics",
    "Household",
    "Health & Wellness",
    "Cleaning Supplies",
    "Furniture",
  ];
  

  useEffect(() => {
    const selectedItem = items.find((item) => item._id === itemCode);
    if (selectedItem) {
      setItem(selectedItem);
      setSelectedUOM(selectedItem.uom);
      setSelectedType(selectedItem.type);
      setName(selectedItem.name);
      setDesc(selectedItem.desc);
      setPrice(selectedItem.price);
      setReorderLevel(selectedItem.reorderLevel);

     
      
      if (action === "increase") {
        setPurchasedDate(new Date().toISOString().split("T")[0]); // Set today's date by default
      } else {
        setPurchasedDate(selectedItem.purchasedDate?.split("T")[0] || "");
      }

      if (action === "increase") {
        setExpDate(selectedItem.expDate?.split("T")[0] || ""); // Set today's date by default
      } else{
        setExpDate(selectedItem.expDate?.split("T")[0] || "");
      }
    }
  }, [itemCode, items, action]);
  

  if (!item) return null; // Return null if item not found

  // Helper function to handle the API requests
  const updateItemInDb = async (updatedItem) => {
    try {
      await axios.put(`http://localhost:5000/api/items/${updatedItem._id}`, updatedItem);
      // Refresh the items list
      const response = await axios.get("http://localhost:5000/api/items/");
      setItems(response.data);
      setFilteredItems(response.data);
      
    } catch (error) {
      console.error("Error updating item:", error);
      Swal.fire({
        title: "Error",
        text: "There was an error updating the item.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const deleteItemFromDb = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${item._id}`);
      // Refresh the items list
      const response = await axios.get("http://localhost:5000/api/items/");
      setItems(response.data);
      setFilteredItems(response.data);
      Swal.fire({
        title: "Success",
        html: `Item ${item.name} (Code: ${item.code}) Deleted Successfully`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      Swal.fire({
        title: "Error",
        text: "There was an error deleting the item.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const increaseItemQty = async () => {
    try {
      const newQty = Number(qty);
      await axios.patch(`http://localhost:5000/api/items/${item._id}/increase`, { 
        quantity: newQty, 
        purchasedDate,
        expDate 
      });
      
      const response = await axios.get("http://localhost:5000/api/items/");
      setItems(response.data);
      setFilteredItems(response.data);
      Swal.fire({
        title: "Success",
        html: `Added quantity to ${item.name} (Code: ${item.code}) <br>Increased Quantity By: ${newQty}`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error increasing item quantity:", error);
      Swal.fire({
        title: "Error",
        text: "There was an error increasing the item quantity.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const decreaseItemQty = async () => {
    try {
      const newQty = Number(qty);
      if (newQty < 0) {
        Swal.fire({
          title: "Error",
          text: "Quantity cannot be less than zero",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      await axios.patch(`http://localhost:5000/api/items/${item._id}/decrease`, { quantity: newQty });
      const response = await axios.get("http://localhost:5000/api/items/");
      setItems(response.data);
      setFilteredItems(response.data);
      Swal.fire({
        title: "Success",
        html: `Removed quantity from ${item.name} (Code: ${item.code})<br>Decreased Quantity By: ${newQty}`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error decreasing item quantity:", error);
      Swal.fire({
        title: "Error",
        text: "There was an error decreasing the item quantity.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const editItem = async () => {
    try {
      const updatedItem = {
        ...item,
        name,
        desc,
        uom: selectedUOM,
        type: selectedType,
        price,
        expDate,
        purchasedDate,
        reorderLevel,
      };
      
      await updateItemInDb(updatedItem);
      Swal.fire({
        title: "Success",
        text: `Edited item ${item.name} (Code: ${item.code}) Successfully`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error editing item:", error);
      Swal.fire({
        title: "Error",
        text: "There was an error editing the item.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
  
    // Allow empty input (optional)
    if (value === "") {
      if (name === "qty") setQty("");
      else if (name === "price") setPrice("");
      else if (name === "reorderLevel") setReorderLevel("");
      return;
    }
  
    // Strict positive number with optional decimal (no symbols, no letters)
    const positiveNumberRegex = /^\d+(\.\d+)?$/;
  
    if (!positiveNumberRegex.test(value)) {
      Swal.fire({
        title: "Invalid Input",
        html: `${name === "qty"
          ? "Quantity"
          : name === "price"
          ? "Price"
          : "Reorder Level"} must be a valid positive number.`,
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        // Reset the value after the Swal alert is closed
        if (name === "qty") setQty("");
        else if (name === "price") setPrice("");
        else if (name === "reorderLevel") setReorderLevel("");
      });
  
      return;
    }
  
    // If valid, set the value
    if (name === "qty") setQty(value);
    else if (name === "price") setPrice(value);
    else if (name === "reorderLevel") setReorderLevel(value);
  };
  
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
    onClick={handleOutsideClick}>
      <div className="bg-white p-6 rounded-lg w-1/3 max-w-md relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-white hover:bg-gray-400 rounded-full p-1"
        >
          <XCircleIcon className="h-7 w-7 text-black-500" />

        </button>

        <h2 className="text-xl font-bold mb-4">{action === "increase" ? "Add Quantity" : action === "delete" ? "Delete Item" : action === "decrease" ? "Remove Quantity" : "Edit Item"}</h2>

        {action === "increase" || action === "decrease" ? (
          <div>
            <div className="mb-4">
              <label className="block font-semibold">Item Name</label>
              <input
                type="text"
                value={item.name}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
  <label className="block font-semibold">Quantity</label>
  <input
    type="number"
    name="qty"
    value={qty}
    onChange={handleNumberInputChange}
    className="w-full px-4 py-2 border border-gray-300 rounded-md"
    min="0" // Ensures only positive numbers or zero are accepted
    
  />
</div>

{action === "increase" && (
  <div>
      <div className="mb-4">
        <label className="block font-semibold">Purchased Date</label>
        <input
          type="date"
          value={purchasedDate}
          onChange={(e) => setPurchasedDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          max={new Date().toISOString().split("T")[0]} // prevent future dates
        />
      </div>

      <div className="mb-4">
  <label className="block font-semibold text-sm">Expiry Date</label>
  <input
    type="date"
    value={expDate}
    onChange={(e) => setExpDate(e.target.value)}
   className="w-full px-4 py-2 border border-gray-300 rounded-md"
    min={new Date().toISOString().split("T")[0]} // Set today's date as the minimum
  />
</div>
</div>
      
    )}

          </div>
        ) : action === "edit" ? (
          <div>
            {/* Name */}
            <div className="mb-4">
              <label className="block font-semibold text-sm">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
              />
            </div>
        
            {/* Description */}
            <div className="mb-4">
              <label className="block font-semibold text-sm">Description</label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
              />
            </div>
        
            {/* Type and UOM */}
            <div className="mb-4 flex gap-x-4">
              <div className="w-1/2">
                <label className="block font-semibold text-sm">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                >
                  {types.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
        
              <div className="w-1/2">
                <label className="block font-semibold text-sm">Unit of Measure</label>
                <select
                  value={selectedUOM}
                  onChange={(e) => setSelectedUOM(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                >
                  {uoms.map((uom, index) => (
                    <option key={index} value={uom.value}>{uom.display}</option>
                  ))}
                </select>
              </div>
            </div>
        
            {/* Price and Reorder Level */}
            <div className="mb-4 flex gap-x-4">
              <div className="w-1/2">
                <label className="block font-semibold text-sm">Price</label>
                <input
                  type="number"
                  name="price"
                  value={price}
                  onChange={handleNumberInputChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                />
              </div>
        
              <div className="w-1/2">
                <label className="block font-semibold text-sm">Reorder Level</label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={reorderLevel}
                  onChange={handleNumberInputChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                  min="0"
                />
              </div>
            </div>
        
            {/* Expiry Date and Purchased Date */}
            <div className="mb-4 flex gap-x-4">
              <div className="w-1/2">
                <label className="block font-semibold text-sm">Expiry Date</label>
                <input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
        
              <div className="w-1/2">
                <label className="block font-semibold text-sm">Purchased Date</label>
                <input
                  type="date"
                  value={purchasedDate}
                  onChange={(e) => setPurchasedDate(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>
        ) 
         : action === "delete" ? (
          <p className="mb-4">
            Are you sure you want to delete the follwing item? 
            <br></br>
            <br></br>Code : <strong>{item.code}</strong>
            <br></br>Name : <strong>{item.name}</strong>
            <br></br>
          </p>
          
        ) : null}

        <div className="flex justify-between">
          <button
            onClick={closeModal}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
  onClick={() => {
    if (action === "increase") increaseItemQty();
    if (action === "decrease") decreaseItemQty();
    if (action === "edit") editItem();
    if (action === "delete") deleteItemFromDb();
    closeModal();
  }}
  className={`${
    action === "delete" ? "bg-red-500" : "bg-blue-500"
  } text-white px-4 py-2 rounded-lg hover:bg-opacity-80`}
>
  {action === "increase"
    ? "Add"
    : action === "decrease"
    ? "Remove"
    : action.charAt(0).toUpperCase() + action.slice(1)}
</button>

        </div>
      </div>
    </div>
  );
};

export default ActionModal;

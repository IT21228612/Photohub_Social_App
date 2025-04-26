import React, { useState } from "react"; // Add this import
import axios from 'axios';
import Swal from "sweetalert2"; // Import SweetAlert2
import { XCircleIcon } from "@heroicons/react/24/solid";

const AddItemModal = ({ closeModal, items, setItems, setFilteredItems }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    unitOfMeasure: '',
    type: '',
    price: '',
    expDate: '',
    purchasedDate: new Date().toISOString().split('T')[0],
    reorderLevel: '', //  Add this line
  });
  

  const [isLoading, setIsLoading] = useState(false); // Loading state

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
  
// The unique user ID 
//used for now 
  const currentUser = { 
    id: '123456',
    name: 'John Doe',
    email: 'john@example.com',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const quantity = formData.quantity;
  
    // If changing UOM to "UNITS", check quantity is a whole number
    if (name === "unitOfMeasure" && value === "UNITS" && quantity.trim() != "") {
      const integerRegex = /^\d+$/;
      if (!integerRegex.test(quantity)) {
        Swal.fire({
          title: "Invalid Input",
          html: "Quantity must be a positive whole number when UOM is 'UNITS'.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
    }
  
    // Update form state
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  


  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
  
    // Allow empty input to not block typing
    if (value === "") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }
  
    const uom = formData.unitOfMeasure; // Access current unit of measure
  
    // If UOM is "units", allow only whole numbers
    if (uom === "UNITS") {
      const integerRegex = /^\d+$/;
      if (!integerRegex.test(value)) {
        Swal.fire({
          title: "Invalid Input",
          html: "Quantity must be a  Positive whole number when UOM is 'units'.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
    } else {
      // For other UOMs, allow decimals
      const positiveNumberRegex = /^\d+(\.\d+)?$/;
      if (!positiveNumberRegex.test(value)) {
        Swal.fire({
          title: "Invalid Input",
          html: `${name === 'quantity'
            ? 'Quantity'
            : name === 'price'
            ? 'Price'
            : 'Reorder Level'} must be a positive number.`,
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
    }
  
    // If valid, update form
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const generateHexCode = () => {
    return Math.floor(Math.random() * 0xFFFFF).toString(16).padStart(5, '0').toUpperCase();
  };
  const itemCodeSuffix = generateHexCode();


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newItem = {
      code: `ITM_${itemCodeSuffix}`,
      name: formData.name,
      desc: formData.description,
      qty: parseInt(formData.quantity, 10),
      uom: formData.unitOfMeasure,
      type: formData.type,
      price: parseFloat(formData.price),
      expDate: formData.expDate,
      purchasedDate: formData.purchasedDate,
      reorderLevel: parseInt(formData.reorderLevel, 10), // ✅ Include reorder level here
      user_id: currentUser.id,
    };
  
    setIsLoading(true);
  
    try {
      const response = await axios.post('http://localhost:5000/api/items', newItem);
  
      setItems((prevItems) => {
        const updatedItems = [...prevItems, response.data];
        setFilteredItems(updatedItems);
        return updatedItems;
      });
  
      Swal.fire({
        title: "Success",
        html: `Item Added Successfully !<br>New Item : ${newItem.name}`,
        icon: "success",
        confirmButtonText: "OK",
      });
  
      // Reset form
      closeModal();
      setFormData({
        name: '',
        description: '',
        quantity: '',
        unitOfMeasure: '',
        type: '',
        price: '',
        expDate: '',
        purchasedDate: new Date().toISOString().split('T')[0],
        reorderLevel: '', // ✅ Reset field here too
      });
  
    } catch (error) {
      console.error('Error adding item:', error);
      Swal.fire({
        title: "Error",
        html: `Item Adding Failed !<br>New Item : ${newItem.name}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-5 rounded-lg w-1/3 max-w-xl max-h-[95vh] overflow-auto relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-white hover:bg-gray-400 rounded-full p-1 transition-all transform duration-300 ease-in-out"
        >
          <XCircleIcon className="h-7 w-7 text-black-500" />
        </button>
        <h2 className="text-lg font-semibold mb-3">Add New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
  
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-1 text-sm border rounded"
              required
            />
          </div>
  
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold">Description:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-1 text-sm border rounded"
              required
            />
          </div>
  
          {/* Type & Price */}
          <div className="flex gap-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold">Type:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-1 text-sm border rounded"
                required
              >
                <option value="" disabled>Select Type</option>
                {types.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
  
            <div className="w-1/2">
              <label className="block text-sm font-semibold">Price:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleNumberInputChange}
                className="w-full p-1 text-sm border rounded"
                required
                min="0"
                step="any"
              />
            </div>
          </div>
  
          {/* Quantity & UOM */}
          <div className="flex gap-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold">Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleNumberInputChange}
                className="w-full p-1 text-sm border rounded"
                required
                min="0"
                step="any"
                placeholder="Initial quantity"
              />
            </div>
  
            <div className="w-1/2">
              <label className="block text-sm font-semibold">Unit of Measure:</label>
              <select
                name="unitOfMeasure"
                value={formData.unitOfMeasure}
                onChange={handleChange}
                className="w-full p-1 text-sm border rounded"
                required
              >
                <option value="" disabled>Select Unit</option>
                {uoms.map((uom, index) => (
                  <option key={index} value={uom.value}>{uom.display}</option>
                ))}
              </select>
            </div>
          </div>
  
          {/* Expiry Date & Purchased Date */}
          <div className="flex gap-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold">Expiry Date:</label>
              <input
                type="date"
                name="expDate"
                value={formData.expDate}
                onChange={handleChange}
                className="w-full p-1 text-sm border rounded"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
  
            <div className="w-1/2">
              <label className="block text-sm font-semibold">Purchased Date:</label>
              <input
                type="date"
                name="purchasedDate"
                value={formData.purchasedDate}
                onChange={handleChange}
                className="w-full p-1 text-sm border rounded"
                required
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
  
          {/* Reorder Level */}
          <div>
            <label className="block text-sm font-semibold">Reorder Level:</label>
            <input
              type="number"
              name="reorderLevel"
              value={formData.reorderLevel}
              onChange={handleNumberInputChange}
              className="w-full p-1 text-sm border rounded"
              required
              min="0"
              step="any"
              placeholder="Minimum quantity before restocking is needed"
            />
          </div>
  
          {/* Buttons */}
          <div className="flex justify-between mt-3">
            <button
              type="button"
              onClick={closeModal}
              className="bg-red-500 hover:bg-red-600 transition-colors duration-300 text-white px-3 py-1 text-sm rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded-lg transition-colors duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
  
  
  
};

export default AddItemModal;

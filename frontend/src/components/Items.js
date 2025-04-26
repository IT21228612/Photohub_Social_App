import React, { useEffect, useState } from "react";
import axios from "axios";  // Import Axios for making API requests
import AddItemModal from "./AddItemModal"; // Import the modal component
import ActionModal from "./ActionModal"; // Import the action modal
import { PlusCircleIcon as OutlinePlusCircleIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon as SolidPlusCircleIcon } from "@heroicons/react/24/solid";
import { MinusCircleIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/solid";




const Items = () => {
  const [items, setItems] = useState([]);  // Items state
  const [filteredItems, setFilteredItems] = useState([]); // Filtered items
  const [types, setTypes] = useState([]); // Item types for filtering
  const [searchQuery, setSearchQuery] = useState("");  // Search query
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);  // Add Item Modal visibility
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);  // Action Modal visibility
  const [selectedItem, setSelectedItem] = useState(null);  // Selected Item for Action Modal
  const [actionType, setActionType] = useState("");  // Action type for the Action Modal
  const [selectedType, setSelectedType] = useState("all");  // Track selected filter type

  //change this to actual user
  const currentUser = { // The unique user ID //used for now
    id: '123456',
    name: 'John Doe',
    email: 'john@example.com',
  };

  // Fetch items from the backend on initial load
  useEffect(() => {
    const fetchItems = async () => {
      try {
      const response = await axios.get(`http://localhost:5000/api/items?user_id=${currentUser.id}`);
  // API endpoint to fetch items
        setItems(response.data);
        setFilteredItems(response.data);

        // Extract unique item types for filtering
        const uniqueTypes = [...new Set(response.data.map((item) => item.type))];
        setTypes(uniqueTypes);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchItems();
  }, []);

  // Search functionality
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);

    const searchedItems = items.filter((item) =>
      Object.values(item).some((field) =>
        field && field.toString().toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setFilteredItems(searchedItems);
  };

  // Type filter functionality
  const handleTypeFilter = (selectedType) => {
    setSelectedType(selectedType); // Set the selected type
    setFilteredItems(selectedType === "all" ? items : items.filter((item) => item.type === selectedType));
  };

  // Modal controls
  const openAddItemModal = () => {
    setIsAddItemModalOpen(true);
  };

  const closeAddItemModal = () => {
    setIsAddItemModalOpen(false);
  };

  const openActionModal = (itemId, action) => {
    console.log("Opening action modal for item ID:", itemId, "with action:", action);
    setSelectedItem(itemId);
    setActionType(action);
    setIsActionModalOpen(true);  // This triggers the modal to open
    console.log("Selected item:", itemId, "Action type:", action, "Modal open:", isActionModalOpen);
  };
  
  

  const closeActionModal = () => {
    setIsActionModalOpen(false);
    setSelectedItem(null);
    setActionType("");
  };

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="w-full flex items-center justify-center mb-4">
          <div className="w-1/2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleSearch}
            />
            <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Search
            </button>
          </div>
        </div>

        {/* Filter by Type and Add Button */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 flex-wrap">
            <button
              className={`${
                selectedType === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
              } px-4 py-2 rounded-lg hover:bg-gray-300`}
              onClick={() => handleTypeFilter("all")}
            >
              All
            </button>
            {types.map((type) => (
              <button
                key={type}
                className={`${
                  selectedType === type ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                } px-4 py-2 rounded-lg hover:bg-gray-300`}
                onClick={() => handleTypeFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Add Button */}
          <button  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={openAddItemModal}>
          <OutlinePlusCircleIcon className="h-5 w-5" />
            New Item
          </button>
        </div>

        {/* Table for displaying items */}
        <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200 shadow-lg text-sm">
  <thead>
    <tr className="bg-gray-100">
      <th className="border border-gray-300 px-1 py-1 text-left">Item Code</th>
      <th className="border border-gray-300 px-1 py-1 text-left">Item Name</th>
      <th className="border border-gray-300 px-1 py-1 text-center">Type</th>
      <th className="border border-gray-300 px-1 py-1 text-left">Description</th>
      <th className="border border-gray-300 px-1 py-1 text-center">Remaining Qty</th>
      <th className="border border-gray-300 px-1 py-1 text-center">UOM</th>
      <th className="border border-gray-300 px-1 py-1 text-center">Price</th>
      <th className="border border-gray-300 px-1 py-1 text-center">Expiry Date</th>
      <th className="border border-gray-300 px-1 py-1 text-center">Purchased Date</th>
      <th className="border border-gray-300 px-1 py-1 text-center">Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredItems.map((item, index) => (
      <tr key={index} className="border border-gray-200 hover:bg-gray-50">
        <td className="border border-gray-300 px-1 py-1">{item.code}</td>
        <td className="border border-gray-300 px-1 py-1">{item.name}</td>
        <td className="border border-gray-300 px-1 py-1">{item.type}</td>
        <td className="border border-gray-300 px-1 py-1">{item.desc}</td>
        <td
  className={`border border-gray-300 px-1 py-1 text-center ${
    item.reorderLevel >= item.qty ? "bg-red-400" : ""
  }`}
  title={item.reorderLevel >= item.qty ? "Stock Level Is Low. Restock This Item !" : ""}
>
  {item.qty}
</td>

        <td className="border border-gray-300 px-1 py-1 text-center">{item.uom}</td>
        <td className="border border-gray-300 px-1 py-1 text-center">{item.price}</td>
        <td className="border border-gray-300 px-1 py-1 text-center">{item.expDate ? new Date(item.expDate).toLocaleDateString() : 'N/A'}</td>
        <td className="border border-gray-300 px-1 py-1 text-center">{new Date(item.purchasedDate).toLocaleDateString()}</td>
        <td className="px-1 py-1 flex justify-center gap-2">
          <button onClick={() => openActionModal(item._id, "increase")} className="text-white px-0.1 py-1 rounded hover:bg-blue-200">
          <SolidPlusCircleIcon className="h-7 w-7 text-blue-500" />
          </button>
          <button onClick={() => openActionModal(item._id, "decrease")} className=" text-white px-0.1 py-1 rounded hover:bg-orange-200">
          <MinusCircleIcon className="h-7 w-7 text-orange-500" />
          </button>
          <button onClick={() => openActionModal(item._id, "edit")} className="text-white px-0.1 py-1 rounded hover:bg-yellow-200">
          <PencilSquareIcon className="h-6 w-6 text-yellow-500" />
          </button>
          <button onClick={() => openActionModal(item._id, "delete")} className="text-white px-0.1 py-1 rounded hover:bg-red-200">
          <TrashIcon className="h-6 w-6 text-red-500" />
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

</div>


      </div>

      {/* Add Item Modal */}
      {isAddItemModalOpen && <AddItemModal closeModal={closeAddItemModal} items={items} setItems={setItems} setFilteredItems={setFilteredItems} />}
      {/* Action Modal */}
      {isActionModalOpen && <ActionModal closeModal={closeActionModal} itemCode={selectedItem} action={actionType} items={items} setItems={setItems} setFilteredItems={setFilteredItems} />}
    </div>
  );
};

export default Items;

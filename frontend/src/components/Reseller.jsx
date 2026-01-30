import React, { useState } from "react";
import {
  Home,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  User,
  Plus,
  Image as ImageIcon,
} from "lucide-react";

const mockUser = {
  name: "Rajiv Maharaj",
  avatar: "/public/images/User.png",
};

const mockProperties = [
  {
    id: 1,
    title: "Bhaisepati 44500, Shrijana Nagar, Kathmandu Valley",
    price: "Rs12000/Month",
    image: "/public/house1.png",
    status: "Rented",
  },
  {
    id: 2,
    title: "Bhaisepati 44500, Shrijana Nagar, Kathmandu Valley",
    price: "Rs12000/Month",
    image: "/public/house2.jpg",
    status: "Expired",
  },
  {
    id: 3,
    title: "Bhaisepati 44500, Shrijana Nagar, Kathmandu Valley",
    price: "Rs12000/Month",
    image: "/public/house3.jpg",
    status: "Hold",
  },
];

const statusFilters = ["All", "Rented", "Expired", "Hold"];

export default function Reseller() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [properties, setProperties] = useState(mockProperties);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
    state: "",
    roomType: "",
    price: "",
    description: "",
    image: null,
  });
  const [formError, setFormError] = useState("");

  const filteredProperties =
    selectedStatus === "All"
      ? properties
      : properties.filter((p) => p.status === selectedStatus);

  function handleFormChange(e) {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone) {
      setFormError("Please fill all required fields.");
      return;
    }
    setFormError("");
    // Add property (demo only, not persistent)
    setProperties([
      {
        id: properties.length + 1,
        title: `${form.address}, ${form.city}, ${form.state}`,
        price: form.price ? `Rs${form.price}/Month` : "Rs0/Month",
        image: form.image ? URL.createObjectURL(form.image) : "/public/house1.png",
        status: "Hold",
      },
      ...properties,
    ]);
    setForm({
      name: "",
      address: "",
      phone: "",
      city: "",
      state: "",
      roomType: "",
      price: "",
      description: "",
      image: null,
    });
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* NavBar */}
      <header className="w-full bg-white border-b shadow-sm flex items-center justify-between px-8 py-3">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            RENTAL NEPAL
          </span>
        </div>
        <nav className="flex space-x-8">
          <button className="hover:text-teal-600">Home</button>
          <button className="hover:text-teal-600">Landlord</button>
          <button className="hover:text-teal-600">Contact Us</button>
          <button className="hover:text-teal-600">Add Listing</button>
          <button className="hover:text-teal-600">Renters</button>
        </nav>
        <div className="flex items-center space-x-2">
          <img src={mockUser.avatar} alt="User" className="w-8 h-8 rounded-full" />
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full py-8 px-4 gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-1/5 mb-8 md:mb-0 flex flex-col items-center md:items-start">
          <img src={mockUser.avatar} alt="User" className="w-16 h-16 rounded-full mb-2" />
          <div className="font-semibold text-gray-700 mb-4">{mockUser.name}</div>
        </aside>

        {/* Main Content */}
        <section className="flex-1">
          <h2 className="text-xl font-bold mb-4">My Listings</h2>
          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded border font-medium transition-all duration-200 ${
                  selectedStatus === status
                    ? "bg-gradient-to-r from-orange-400 to-red-400 text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          {/* Property Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow p-4 flex flex-col items-center border hover:shadow-lg transition"
              >
                <img
                  src={property.image}
                  alt="Property"
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <div className="font-medium text-gray-800 text-center mb-1">
                  {property.title}
                </div>
                <div className="text-orange-600 font-bold text-lg mb-1">{property.price}</div>
                <div className="text-xs text-gray-500">Status: {property.status}</div>
              </div>
            ))}
          </div>

          <div className="text-center font-medium text-gray-700 mb-6">
            Your Property With Us And Be Confident That Your Room Will Be Filled Out!
          </div>

          {/* Add New Property Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto border">
            <h3 className="text-xl font-bold text-orange-600 mb-6 text-center">Add a New Property</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Name*"
                  className="border rounded px-3 py-2 w-full"
                  required
                />
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleFormChange}
                  placeholder="Address*"
                  className="border rounded px-3 py-2 w-full"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  placeholder="Phone Number*"
                  className="border rounded px-3 py-2 w-full"
                  required
                />
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleFormChange}
                  placeholder="City"
                  className="border rounded px-3 py-2 w-full"
                />
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleFormChange}
                  placeholder="State"
                  className="border rounded px-3 py-2 w-full"
                />
                <input
                  type="text"
                  name="roomType"
                  value={form.roomType}
                  onChange={handleFormChange}
                  placeholder="Room Type"
                  className="border rounded px-3 py-2 w-full"
                />
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleFormChange}
                  placeholder="Price"
                  className="border rounded px-3 py-2 w-full"
                />
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Description"
                className="border rounded px-3 py-2 w-full"
                rows={3}
              />
              <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 flex flex-col items-center">
                <label className="flex flex-col items-center cursor-pointer">
                  <ImageIcon className="w-8 h-8 text-orange-400 mb-2" />
                  <span className="text-gray-500 text-sm mb-2">Drag and drop image, or click to select</span>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFormChange}
                    className="hidden"
                  />
                  {form.image && (
                    <span className="text-green-600 text-xs mt-1">{form.image.name}</span>
                  )}
                </label>
              </div>
              {formError && <div className="text-red-500 text-sm text-center">{formError}</div>}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold text-lg shadow hover:shadow-lg transition-all duration-300"
              >
                Add New Listing
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-1 flex flex-col items-center md:items-start mb-6 md:mb-0">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center mb-2">
              <Home className="w-8 h-8 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              RENTAL NEPAL
            </span>
            <div className="text-gray-500 text-sm">Bhaisepati 44500, Shrijana Nagar, Kathmandu Valley</div>
            <div className="flex space-x-3 mt-2">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-400 cursor-pointer" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center md:items-start">
            <div className="flex items-center mb-2">
              <Phone className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-gray-700 text-sm">+977-1-4234567</span>
            </div>
            <div className="flex items-center mb-2">
              <Mail className="w-4 h-4 text-red-400 mr-2" />
              <span className="text-gray-700 text-sm">info@rentalbuddy.com</span>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-400 text-xs mt-6">
          ABOUT US &nbsp; | &nbsp; CONTACT US &nbsp; | &nbsp; MAP &nbsp; | &nbsp; PRIVACY POLICY &nbsp; | &nbsp; SOCIAL LINKS
        </div>
      </footer>
    </div>
  );
} 
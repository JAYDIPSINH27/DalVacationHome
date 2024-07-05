import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

function RoomDetails() {
  const location = useLocation();
  const { room } = location.state || {};

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleBookRoom = () => {
    // Placeholder for booking logic
    console.log("Booking room:", room.name, "from", startDate, "to", endDate);
    // Implement actual booking logic here
  };

  if (!room) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <Navbar />
        <h2 className="text-2xl">No room details available</h2>
      </div>
    );
  }

  return (
    <>
      <div className="w-screen h-screen overflow-auto flex flex-col items-center">
        <Navbar />
        <div className="mt-4 w-11/12 md:w-3/4 lg:w-2/3 p-4 border border-gray-300 rounded shadow-lg">
          <h3 className="text-3xl font-semibold mb-4 text-center">Room Name: {room.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <img
                src={room.image}
                alt={`Room ${room.room_number}`}
                className="w-full h-64 object-cover rounded shadow"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-lg mb-2">
                  <span className="font-semibold">Room Number:</span> {room.room_number}
                </p>
                <p className="text-lg mb-2">
                  <span className="font-semibold">Description:</span> {room.description}
                </p>
                <p className="text-lg mb-2">
                  <span className="font-semibold">Capacity:</span> {room.capacity}
                </p>
                <p className="text-lg mb-2">
                  <span className="font-semibold">Price:</span> ${room.price}
                </p>
              </div>
              <div className="mt-4">
                <label className="block text-lg font-semibold mb-1">Select Dates:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 self-center"
                onClick={handleBookRoom}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoomDetails;

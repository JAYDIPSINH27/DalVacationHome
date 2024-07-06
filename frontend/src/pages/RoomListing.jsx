import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Chatbot from "../components/Chatbot";

function RoomListing() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [roomsData, setRoomsData] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

  const isSearchDisabled = !startDate || !endDate;

  const navigate = useNavigate();

  const handleSearch = () => {
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("End date must be after start date.");
      return;
    }

    console.log(
      "Searching for available rooms between",
      startDate,
      "and",
      endDate
    );

    axios
      .get(`https://u73vi9w6la.execute-api.us-east-1.amazonaws.com/dev/rooms`)
      .then((response) => {
        const roomsData = JSON.parse(response.data.body);
        setRoomsData(roomsData);

        

        // Filter rooms based on availability
        const available = roomsData.filter((room) => {
          let isAvailable = true;

          for (let i = 0; i < room.dates.length; i++) {
            const roomStartDate = new Date(room.dates[i].StartDate);
            const roomEndDate = new Date(room.dates[i].EndDate);
            const searchStartDate = new Date(startDate);
            const searchEndDate = new Date(endDate);

            // Check for overlap
            if (
              !(searchEndDate < roomStartDate || searchStartDate > roomEndDate)
            ) {
              isAvailable = false; // Dates overlap, room is not available
              break; // No need to check further dates
            }
          }

          return isAvailable;
        });

        setAvailableRooms(available);
        console.log("Available Rooms:", available);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
        toast.error("Error fetching rooms. Please try again later.");
      });
  };

  // const redirectRoomDetails = (room) => {
  //   navigate("/roomDetails", { state: { room } })
  // };
  const redirectRoomDetails = (room) => {
    navigate(`/room/${room.room_number}`,{state:{room:room}});

  };


  return (
    <>
      <div className="w-screen h-screen overflow-auto flex flex-col items-center">
        <Navbar />

        <div className="w-full p-4 flex items-center justify-center text-lg space-x-4 bg-gray-300">
          <ToastContainer />

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
          <button
            onClick={handleSearch}
            className={`p-2 text-white rounded px-6 ${
              isSearchDisabled ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
            }`}
            disabled={isSearchDisabled}
          >
            Search
          </button>
        </div>

        {/* Display available rooms in grid */}
        <div className="mt-4 grid grid-cols-4 gap-4 p-10">
          {availableRooms.map((room, index) => {
                        // Ensure amenities is an array
                        const amenitiesArray = Array.isArray(room.amenities)
                        ? room.amenities
                        : Object.values(room.amenities);
            return (
            <div
              key={index}
              className="border border-gray-500 rounded p-4 hover:shadow-2xl hover:shadow-black"
            >
              <h3 className="text-xl font-semibold border-b-2 border-black pb-2 mb-2">
                Room Name: {room.name}
              </h3>
              <p>Room Number : {room.room_number}</p>
              <p>{room.description}</p>
              <p>Capacity : {room.capacity}</p>
              <p>Price: ${room.price}</p>
              <img
                src={room.image}
                alt={`Room ${room.room_number}`}
                className="w-full h-48 object-cover rounded mt-4"
              />
                {/* <p>Amenities:</p>
                <ul>
                  {amenitiesArray.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul> */}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 flex justify-center items-center w-full"
                onClick={() => redirectRoomDetails(room)} // Pass the room object correctly
              >
                More Details
              </button>
              {/* <p>Dates:</p>
              <ul>
                {room.dates.map((date, idx) => (
                  <li key={idx}>
                    <p>Start Date: {date.StartDate}</p>
                    <p>End Date: {date.EndDate}</p>
                  </li>
                ))}
              </ul> */}
            </div>
          );
})}
        </div>
      </div>
      <Chatbot />
    </>
  );
}

export default RoomListing;

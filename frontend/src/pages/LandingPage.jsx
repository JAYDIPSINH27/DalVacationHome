import React from "react"
import { useNavigate } from "react-router-dom";
import { ReactTyped } from "react-typed";

function LandingPage() {

  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/home');
  }

  return (
    <div className="w-screen h-screen">
      <div className="flex justify-start items-center px-[50px] ">
        <div className="w-[150px] p-4">
          <img
            src={
              "https://firebasestorage.googleapis.com/v0/b/webt3-8766f.appspot.com/o/hotel-booking-concept-flat-style.png?alt=media&token=c597c532-45aa-4fb6-8e08-d4bdff5d6e29"
            }
            alt="Chatter Hub Logo"
          />
        </div>
        <div>
          <p className="text-5xl font-bold">Dal Vacation Home</p>
        </div>
      </div>

      <div className="flex justify-between pl-[85px]">
        <div className="w-full mx-auto text-center flex-1 flex flex-col justify-center items-start pt-12">
          <p className="text-xl text-start font-bold">
            Get rooms for anyone from anywhere. Book effortlessly with Dal Vacation Home
          </p>
          <h1 className="text-start text-4xl font-bold py-6">
            Confirm booking seamlessly.
          </h1>
          <div className="flex justify-center items-center">
            <p className="text-start text-3xl font-bold py-4 ">
              A Unified Platform for
              <ReactTyped
                className="md:text-3xl sm:text-4xl text-xl font-bold md:pl-2 pl-2"
                strings={["Friends", "Families", "Loved ones"]}
                typeSpeed={100}
                backSpeed={120}
                loop
              />
            </p>
          </div>
          <p className="text-start  text-xl font-bold text-white py-5">
            Start booking now! Sign up for free and book your first room.
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-900 text-white text-2xl font-bold py-2 px-4 rounded mt-4"
            onClick={() => handleClick()}
          >
            Get Started
          </button>

        </div>

        <div className="flex flex-1 items-start justify-center">
          <img
            src={
              "https://firebasestorage.googleapis.com/v0/b/webt3-8766f.appspot.com/o/hotel-booking-concept-flat-style.png?alt=media&token=c597c532-45aa-4fb6-8e08-d4bdff5d6e29"
            }
            className="w-[450px] h-[450px] object-cover"
            alt="Girl Chatting"
          />
        </div>
      </div>
    </div>
  );
}

export default LandingPage

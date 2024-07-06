import React from 'react'
import {useLocation} from 'react-router-dom'
function RoomDetails() {
  const location = useLocation()

  console.log(location.state.room)
  return (
    <div>RoomDetails</div>
  )
}

export default RoomDetails
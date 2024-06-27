import Room from '../assets/room.jpg';

const dummyRooms = [
    {
      id: '1',
      name: 'Deluxe Ocean View',
      description: 'Spacious room with a stunning view of the ocean. Perfect for couples or small families.',
      price: 250,
      capacity: 3,
      imageUrl: Room,
      availableDates: generateDates(30)  // Next 30 days
    },
    {
      id: '2',
      name: 'Family Suite',
      description: 'Large suite with separate living area and two bedrooms. Ideal for families or groups.',
      price: 400,
      capacity: 6,
      imageUrl: Room,
      availableDates: generateDates(30)  // Next 30 days
    },
    {
      id: '3',
      name: 'Cozy Mountain Cabin',
      description: 'Rustic cabin with fireplace and mountain views. Perfect for a romantic getaway.',
      price: 180,
      capacity: 2,
      imageUrl: Room,
      availableDates: generateDates(30)  // Next 30 days
    },
    {
      id: '4',
      name: 'Luxury Penthouse',
      description: 'Top floor penthouse with panoramic city views, jacuzzi, and private terrace.',
      price: 800,
      capacity: 4,
      imageUrl: Room,
      availableDates: generateDates(30)  // Next 30 days
    },
    {
      id: '5',
      name: 'Beachfront Bungalow',
      description: 'Charming bungalow steps away from the beach. Includes private patio and outdoor shower.',
      price: 300,
      capacity: 3,
      imageUrl: Room,
      availableDates: generateDates(30)  // Next 30 days
    }
  ];
  
  // Helper function to generate an array of date strings for the next n days
  function generateDates(days) {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);  // Format as 'YYYY-MM-DD'
    }
    return dates;
  }
  
  export function fetchAvailableRooms() {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        resolve(dummyRooms);
      }, 1000);
    });
  }
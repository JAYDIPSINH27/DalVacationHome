import Room from '../assets/room.jpg';

export const dummyRooms = [
    {
      id: '1',
      name: 'Guest Room 1',
      description: 'Spacious room with a stunning view of the ocean. Perfect for couples or small families.',
      price: 250,
      capacity: 3,
      imageUrl: Room,
      availableDates: generateDates(30),  // Next 30 days
      amenities: ['Ocean View', 'Free Wi-Fi', 'Air Conditioning']
    },
    {
      id: '2',
      name: 'Guest Room 2',
      description: 'Large suite with separate living area and two bedrooms. Ideal for families or groups.',
      price: 400,
      capacity: 6,
      imageUrl: Room,
      availableDates: generateDates(30),  // Next 30 days
      amenities: ['Two Bedrooms', 'Living Area', 'Mountain View']
    },
    {
      id: '3',
      name: 'Guest Room 3',
      description: 'Rustic cabin with fireplace and mountain views. Perfect for a romantic getaway.',
      price: 180,
      capacity: 2,
      imageUrl: Room,
      availableDates: generateDates(30),  // Next 30 days
      amenities: ['Fireplace', 'Mountain View', 'Private Patio']
    },
    {
      id: '4',
      name: 'Guest Room 4',
      description: 'Top floor penthouse with panoramic city views, jacuzzi, and private terrace.',
      price: 800,
      capacity: 4,
      imageUrl: Room,
      availableDates: generateDates(30),  // Next 30 days
      amenities: ['Panoramic City View', 'Jacuzzi', 'Private Terrace']
    },
    {
      id: '5',
      name: 'Guest Room 5',
      description: 'Charming bungalow steps away from the beach. Includes private patio and outdoor shower.',
      price: 300,
      capacity: 3,
      imageUrl: Room,
      availableDates: generateDates(30),  // Next 30 days
      amenities: ['Beachfront', 'Private Patio', 'Outdoor Shower']
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

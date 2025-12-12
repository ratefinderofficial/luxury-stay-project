const Room = require('../models/Room');

const rooms = [
    {
        roomNumber: '101',
        type: 'Standard',
        price: 100,
        capacity: 2,
        description: 'Cozy standard room with city view, perfect for solo travelers or couples.',
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Coffee Maker'],
        currentStatus: 'Available',
        roomImages: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070']
    },
    {
        roomNumber: '102',
        type: 'Standard',
        price: 100,
        capacity: 2,
        description: 'Standard room with twin beds and essential amenities.',
        amenities: ['WiFi', 'TV', 'Air Conditioning'],
        currentStatus: 'Occupied',
        roomImages: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070']
    },
    {
        roomNumber: '201',
        type: 'Deluxe',
        price: 180,
        capacity: 2,
        description: 'Spacious deluxe room with king-size bed and balcony.',
        amenities: ['WiFi', 'TV', 'AC', 'Minibar', 'Balcony', 'Safe'],
        currentStatus: 'Available',
        roomImages: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074']
    },
    {
        roomNumber: '202',
        type: 'Deluxe',
        price: 180,
        capacity: 3,
        description: 'Deluxe room with extra bed space and pool view.',
        amenities: ['WiFi', 'TV', 'AC', 'Minibar', 'Work Desk'],
        currentStatus: 'Cleaning',
        roomImages: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074']
    },
    {
        roomNumber: '301',
        type: 'Suite',
        price: 350,
        capacity: 4,
        description: 'Luxury suite with separate living area and jacuzzi.',
        amenities: ['WiFi', '4K TV', 'Central AC', 'Jacuzzi', 'Living Room', 'Room Service'],
        currentStatus: 'Available',
        roomImages: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070']
    },
    {
        roomNumber: '302',
        type: 'Family',
        price: 250,
        capacity: 5,
        description: 'Large family room with two double beds and kids play area.',
        amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Kids Area'],
        currentStatus: 'Available',
        roomImages: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070']
    },
    {
        roomNumber: '401',
        type: 'Penthouse',
        price: 800,
        capacity: 6,
        description: 'Exclusive top-floor penthouse with panoramic views and private butler service.',
        amenities: ['Private Pool', 'Butler Service', 'Cinema', 'Gym', 'Full Kitchen'],
        currentStatus: 'Maintenance',
        roomImages: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070']
    }
];

const seedRooms = async () => {
    try {
        await Room.deleteMany();
        console.log('Room collection cleared.');

        await Room.insertMany(rooms);
        console.log('✅ Dummy Rooms Imported!');
    } catch (error) {
        console.error(`Error importing rooms: ${error.message}`);
        process.exit(1);
    }
};

module.exports = seedRooms;
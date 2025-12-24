const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Models Import Karo (Path check karlena)
const Room = require('./models/Room');
const User = require('./models/User');
const Booking = require('./models/Booking');
const Invoice = require('./models/Invoice');

dotenv.config();

// --- DATABASE CONNECT ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/luxury_stay')
  .then(() => console.log('🔥 MongoDB Connected for Seeding...'))
  .catch(err => {
      console.error(err);
      process.exit(1);
  });

// --- DATA ---
const roomsData = [
  {
    roomNumber: "101",
    type: "Standard",
    price: 100,
    capacity: 2,
    description: "A cozy standard room with all essential amenities. Perfect for solo travelers or couples on a short stay. Features a queen-size bed and city view.",
    amenities: ["WiFi", "TV", "AC", "Work Desk"],
    roomImages: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070"],
    currentStatus: "Available"
  },
  {
    roomNumber: "102",
    type: "Standard",
    price: 120,
    capacity: 2,
    description: "Standard room with a garden view. Quiet and peaceful environment with modern decor.",
    amenities: ["WiFi", "TV", "AC", "Coffee Maker"],
    roomImages: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070"],
    currentStatus: "Available"
  },
  {
    roomNumber: "201",
    type: "Deluxe",
    price: 250,
    capacity: 2,
    description: "Spacious Deluxe room offering premium comfort. Includes a balcony with ocean views and a mini-bar.",
    amenities: ["WiFi", "TV", "AC", "Mini Bar", "Balcony", "Ocean View"],
    roomImages: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074"],
    currentStatus: "Available"
  },
  {
    roomNumber: "202",
    type: "Deluxe",
    price: 280,
    capacity: 3,
    description: "Deluxe room with extra space for a small family. Features premium bedding and a large bathroom with a bathtub.",
    amenities: ["WiFi", "TV", "AC", "Bathtub", "Fridge"],
    roomImages: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070"],
    currentStatus: "Available"
  },
  {
    roomNumber: "301",
    type: "Suite",
    price: 450,
    capacity: 4,
    description: "Luxury Suite with a separate living area. Ideal for extended stays and business travelers looking for luxury.",
    amenities: ["WiFi", "Smart TV", "AC", "Living Room", "Dining Area", "Work Station"],
    roomImages: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070"],
    currentStatus: "Available"
  },
  {
    roomNumber: "305",
    type: "Suite",
    price: 500,
    capacity: 4,
    description: "Executive Suite offering panoramic city views. Includes VIP concierge service and access to the executive lounge.",
    amenities: ["WiFi", "Smart TV", "AC", "VIP Service", "Lounge Access"],
    roomImages: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070"],
    currentStatus: "Available"
  },
  {
    roomNumber: "401",
    type: "Luxury",
    price: 800,
    capacity: 2,
    description: "Honeymoon special luxury room. Romantic setting with jacuzzi, flower arrangements on arrival, and sunset view.",
    amenities: ["WiFi", "Jacuzzi", "AC", "Romantic Decor", "Champagne Service"],
    roomImages: ["https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1974"],
    currentStatus: "Available"
  },
  {
    roomNumber: "500",
    type: "Penthouse",
    price: 1500,
    capacity: 6,
    description: "The ultimate Presidential Penthouse. 3 Bedrooms, Private Pool, Personal Butler, and Rooftop Terrace.",
    amenities: ["Private Pool", "Butler", "Kitchen", "Rooftop", "Home Theater"],
    roomImages: ["https://images.unsplash.com/photo-1631049552057-403cdb8f0658?q=80&w=2070"],
    currentStatus: "Available"
  },
  {
    roomNumber: "103",
    type: "Standard",
    price: 110,
    capacity: 2,
    description: "Budget-friendly standard room without compromising on quality. Comfortable bed and clean hygiene.",
    amenities: ["WiFi", "TV", "AC"],
    roomImages: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074"],
    currentStatus: "Maintenance" // Ek room maintenance mein dikhana zaroori hai
  },
  {
    roomNumber: "104",
    type: "Standard",
    price: 115,
    capacity: 1,
    description: "Single Standard room for solo backpackers.",
    amenities: ["WiFi", "AC"],
    roomImages: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070"],
    currentStatus: "Cleaning" // Ek room cleaning mein
  }
];

// --- SEED FUNCTION ---
const importData = async () => {
  try {
    // 1. Clear Old Data
    await Room.deleteMany();
    await User.deleteMany();
    await Booking.deleteMany();
    await Invoice.deleteMany();
    console.log('🧹 Old Data Cleared...');

    // 2. Create Users
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('123456', salt);
    const guestHash = await bcrypt.hash('123456', salt);

    const users = await User.insertMany([
      {
        name: 'Super Admin',
        email: 'admin@luxurystay.com',
        password: adminHash,
        phone: '1234567890',
        role: 'admin'
      },
      {
        name: 'Ali Khan (Guest)',
        email: 'guest@test.com',
        password: guestHash,
        phone: '03001234567',
        role: 'guest'
      }
    ]);
    console.log('👤 Users Created (Admin & Guest)...');

    // 3. Create Rooms
    await Room.insertMany(roomsData);
    console.log('🏨 10 Rooms Created...');

    console.log('✅ DATA SEEDED SUCCESSFULLY!');
    process.exit();
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
};

importData();
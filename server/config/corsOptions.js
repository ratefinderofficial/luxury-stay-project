const corsOptions = {
  origin: (origin, callback) => {
    // Development mein null/undefined origin allow karein (e.g. Postman or Localhost)
    if (!origin || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
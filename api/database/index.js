const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.MONGO_URL || "127.0.0.1"}:27017/beercounter`);
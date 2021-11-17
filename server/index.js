require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routes/user');

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@class-assignment.yrohp.mongodb.net/class-assignment?retryWrites=true&w=majority`, {});
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/user', userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


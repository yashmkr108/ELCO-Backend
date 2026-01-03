import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './routes/auth';
import mongoose from 'mongoose';

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);

const StartDataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Succesfully Connected to DB !');
  } catch (e) {
    console.log(`Not able to Connect to DB ${e}`);
  }
};

const StartServer = async () => {
  StartDataBase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  });
};

StartServer();

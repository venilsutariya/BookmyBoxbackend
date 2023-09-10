import mongoose, { ConnectOptions } from "mongoose";

export const connectToDatabase = async (URI: string) => {
  try {
    mongoose.Promise = Promise;
    mongoose.connect(URI).then(() => console.log('connected to database successFully'));
    mongoose.connection.on('error' , (error : Error) => console.log(error));

  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};
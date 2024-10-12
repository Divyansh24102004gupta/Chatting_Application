import mongoose from "mongoose";
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongoDB!");
  } catch (error) {
    console.log("error while connecting to mongoDB:  ", error);
  }
};

export default connectToMongoDB;

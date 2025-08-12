// import mongoose from "mongoose";

// export const connectDatabase = async ()=>{
//     try {
//           const {connection} = await mongoose.connect(process.env.MONGO_URL);
//           console.log("MongoDB connected to "+ connection.host);
      
//     } catch (error) {
//       console.log(error);
//       process.exit(1);
//     }

// }

import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // This option is important for index creation
      // useFindAndModify: false, // This option is important to avoid deprecation warnings
    };

    await mongoose.connect(process.env.MONGO_URL, options);
    console.log("MongoDB connected to " + mongoose.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

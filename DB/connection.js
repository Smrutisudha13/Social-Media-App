import mongoose from "mongoose";
const connectDB = async () => {
    mongoose.set("strictQuery", false);
    return await mongoose.connect(process.env.DBURI)
        .then(() => console.log(`connected DB on Server`))
        .catch(err => console.log(`Fail to connected DB on ......... ${err}`))

}
export default connectDB
import mongoose from "mongoose";

const con = async()=>{
    try{
      const connection = await mongoose.connect("mongodb://localhost:27017/")
      return connection
    }catch(err)
    {
        console.log(err)
    }
}
export default con
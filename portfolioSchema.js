// models/Project.js
import mongoose from 'mongoose';

mongoose.connect("mongodb://localhost:27017/Portfolio")
.then(()=>{
    console.log("connect to MongoDB")
})

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    technologies: {
      type: [String],
      default: [],
    },
    image: {
      type: String, // Base64 string
      required: [true, 'Image is required'],
    },
    githubLink: {
      type: String,
      validate: {
        validator: (val) => /^https?:\/\/.+/.test(val),
        message: 'Invalid GitHub URL',
      },
    },
    liveLink: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
 const portfolioModel =  mongoose.model('Portfolio', portfolioSchema);
export default portfolioModel;

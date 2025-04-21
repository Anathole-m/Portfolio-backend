import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware to parse JSON from requests
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))


// MongoDB connection
mongoose.connect("mongodb://localhost:27017/Portfolio", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Portfolio Schema
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

const PortfolioModel = mongoose.model("Portfolio", portfolioSchema);

// API - POST
app.post("/info", async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      image,
      githubLink,
      liveLink,
      isFeatured
    } = req.body;

    const newPortfolio = new PortfolioModel({
      title,
      description,
      technologies,
      image,
      githubLink,
      liveLink,
      isFeatured
    });

    const savedData = await newPortfolio.save();

    res.status(201).json({
      message: "Information recorded successfully",
      data: savedData
    });

  } catch (error) {
    res.status(400).json({
      message: "Failed to save portfolio info",
      error: error.message
    });
  }
});
// update information

app.put("/info/update/:id", async(req,res)=>{
  const {
    title,
    description,
    technologies,
    image,
    githubLink,
    liveLink,
    isFeatured
  } = req.body;
  const{id}=req.query;
  const update = await PortfolioModel.findByIdAndUpdate(id,{
    title,
    description,
    technologies,
    image,
    githubLink,
    liveLink,
    isFeatured,
  },
  {
    new: true, // return updated doc
    runValidators: true, // apply schema validation
  }
)
if (!update) {
  return res.status(404).json({ message: "Info not found" });
}
  res.status(201).json({"message":"data updated succufully","updatedInfo":update})
})

//update specific info

app.put("/info/specific/:id", async(req,res)=>{
   const{id}=req.query
   const updateSpec= await PortfolioModel.findByIdAndUpdate(id,req.body,
    {
      new: true,
      runValidators: true,
    }
   )
   if (!updateSpec) {
    return res.status(404).json({ message: "Item not found" });
  }
  res.status(201).json({"message":"data updated succufully","updatedInfo":updateSpec})

})
//Delete info

app.delete("/info/delete/:id", async (req, res) => {
  const { id } = req.query;
  const Delete = await PortfolioModel.findByIdAndDelete(id)

  res.status(204).json({"deleted":Delete})

})

//select all information
app.get("/info/select", async(req,res)=>{
  const allInfo= await PortfolioModel.find()
  res.status(201).json({"allinformation":allInfo})
})
// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

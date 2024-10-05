import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.get("/products", async (req, res) => {
  try {
    const response = await axios.get(
      "https://dummyjson.com/products?limit=194"
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching products");
  }
});

export default app;

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

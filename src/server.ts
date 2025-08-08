import express from "express";
import "dotenv/config";
import moderationRouter from "./routes/moderation.routes";


const app = express();
// middleware để parse JSON bodies
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/comments", moderationRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

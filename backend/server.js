const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB Atlas"))
  .catch(err => console.error("❌ Erro ao conectar:", err))

app.use("/api/technical", require("./routes/user"))
app.use("/api/machine", require("./routes/machine"))
app.use("/api/maintenance", require("./routes/maintenance"))

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
})

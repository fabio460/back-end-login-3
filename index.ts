import express from "express";
import cors from "cors";
import { listarUsuario } from "./controllers/usuarioController.js";
const app =  express()

app.use(cors())
app.use(express.json())
app.get("/", listarUsuario)
app.listen(4000,()=>console.log("rodando na porta 4000"))
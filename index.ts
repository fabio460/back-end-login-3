import express from "express";
import cors from "cors";
import { autenticarUsuario, cadastrarUsuario, listarUsuario, logarUsuario } from "./controllers/usuarioController.js";
const app =  express()

app.use(cors())
app.use(express.json())
app.get("/", listarUsuario)
app.post("/cadastrar",cadastrarUsuario)
app.post("/logar",logarUsuario)
app.post("/autenticar",autenticarUsuario)

app.listen(4000,()=>console.log("rodando na porta 4000"))
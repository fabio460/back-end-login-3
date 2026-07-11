import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient()
export const listarUsuario = async(req:Request,res:Response)=>{
    const usuario = await prisma.usuario.findMany()

    res.json(usuario)
}
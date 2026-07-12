import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const chaveSecreta = "chavetoken"
const prisma = new PrismaClient()

export const listarUsuario = async(req:Request,res:Response)=>{
    const usuario = await prisma.usuario.findMany()
    res.json(usuario)
}

export const cadastrarUsuario = async (req:Request, res:Response)=>{
    const {nome, email, senha} = req.body
    if (!nome && !email && !senha) {
        return res.status(400).json("insira os dados completos!")
    }
    const usuario = await prisma.usuario.findUnique({
        where:{
            email
        }
    })
    if (usuario) {
        return res.status(401).json("Este usuário já existe!")
    }
    const salt = await bcrypt.genSalt(10)
    const senhaCriptografada = await bcrypt.hash(senha,salt)
    try {
        await prisma.usuario.create({
            data:{
                email,
                nome,
                senha:senhaCriptografada
            }
        })
       return res.status(200).json("Usuario cadastrado com succeso!")
    } catch (error) {
       return res.status(401).json("Falha ao cadastrar usuário!")
    }
}

export const logarUsuario =  async (req:Request, res:Response)=>{
   const {email, senha} = req.body

   if (!email && !senha) {
      res.status(401).json("Insira um email e uma senha")
   }
   const usuario = await prisma.usuario.findUnique({where:email})
   try {    
       const senhaValida =await bcrypt.compare(senha, usuario?.senha as string)
       if (senhaValida) {
          const token = jwt.sign({usuario},chaveSecreta,{expiresIn:"1d"})
          return res.status(200).json({
            id:usuario?.id,
            nome:usuario?.nome, 
            email:usuario?.email,
            token
        })
       }
   } catch (error) {
      return res.status(400).json("Email ou senha in válidos!")
   }
}

export const autenticarUsuario =  async (req:Request, res:Response)=>{
    try {
       const token = req.headers.authorization?.split(" ")[1] as string
       jwt.verify(token,chaveSecreta)
       const usuario = jwt.decode(token)
       res.status(200).json({
         usuario
       })
   } catch (error) {
      res.status(400).json("Usuário não esta logado!")
   }
}
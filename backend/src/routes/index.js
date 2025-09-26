import express from 'express'
import { authRoute } from './auth.route.js'
import  { medicineRoute } from './medicine.route.js'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(200).json({ message: 'API is running' })
})

Router.use('/auth', authRoute)
Router.use('/medicine', medicineRoute)

export const APIs = Router
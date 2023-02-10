import './config.js'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { loginUser, registerUser } from './controller/authController.js'
import { encrypt } from './middleware/auth.js'
import { addFavorite } from './controller/FavoriteController.js'


const PORT = process.env.PORT
const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())


app.post('/api/register', encrypt, registerUser)
app.post('/api/login', encrypt, loginUser)
app.post('/api/addFavorite', addFavorite)




app.listen(PORT, () => console.log('Server runs on Port:', PORT))
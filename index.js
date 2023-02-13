import './config/config.js'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import multer from "multer"
import { loginUser, registerUser } from './controller/authController.js'
import { encrypt } from './middleware/auth.js'
import { favoriteController } from './controller/FavoriteController.js'
import { spotifyLoginController, spotifyRefreshController } from './controller/MusicController.js'
import { upload } from './middleware/fileSaver.js'
import { uploadImage } from './controller/fileUploadController.js'

const PORT = process.env.PORT
const app = express()


app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.post('/api/register', encrypt, registerUser)
app.post('/api/login', encrypt, loginUser)
app.post('/api/favorites', favoriteController)
// app.post('/api/additem', multerUploads, addItem)
app.get('/api/getSongs',)

//SPOTIFY API
app.post("/refresh", spotifyRefreshController)
app.post("/login", spotifyLoginController)

app.post("/api/upload", upload.array("image"), uploadImage)


app.listen(PORT, () => console.log('Server runs on Port:', PORT))
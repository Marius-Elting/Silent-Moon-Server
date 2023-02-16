import './config/config.js';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { editUser, loginUser, registerUser } from './controller/userController.js';
import { auth, encrypt } from './middleware/auth.js';
import { favoriteController } from './controller/FavoriteController.js';
import { addNewPlayListToDataBase, getAllPlaylists, getSinglePlaylist, spotifyLoginController, spotifyRefreshController } from './controller/MusicController.js';
import { upload } from './middleware/fileSaver.js';
import { getExercise, getSingleExercise, addExercise } from './controller/exerciseController.js';
import { addSingleCategory, getAllCategories, getCategoryByType, getSingleCategory } from './controller/categoryController.js';
import cookieParser from "cookie-parser";

const PORT = process.env.PORT;
const app = express();

app.use(cookieParser());

app.use(morgan('dev'));
// app.use(cors({origin: [process.env.FRONTEND_URL], credentials: true}));
app.use(cors({
    credentials: true,
    origin: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//User
app.post('/api/register', encrypt, registerUser);
app.post('/api/login', encrypt, loginUser);
app.post('/api/editUser', auth, editUser);

app.post('/api/favorites', auth, favoriteController);

//SPOTIFY API
app.post("/refresh", auth, spotifyRefreshController);
app.post("/login", auth, spotifyLoginController);

//Exercise
app.post("/api/upload", auth, upload.array("image"), addExercise);
app.get("/api/getexercise", auth, getExercise);
app.get("/api/getsingleexercise/:id", auth, getSingleExercise);
//Categories
app.get("/api/getcategories", auth, getAllCategories);
app.post("/api/getsinglecategory", auth, getSingleCategory);
app.post("/api/createcategory", auth, upload.array("image"), addSingleCategory);
app.post("/api/getcategorybytype", auth, getCategoryByType);

//Music
app.get("/api/getmusicpreview/", auth, addNewPlayListToDataBase);
// app.get("/api/getmusicpreview/:playlistID", getSpotPlayList)
app.get("/api/getallplaylists/", auth, getAllPlaylists);
app.get("/api/getsingleplaylist/:id", auth, getSinglePlaylist);

app.listen(PORT, () => console.log('Server runs on Port:', PORT));
import './config/config.js';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { editUser, loginUser, registerUser } from './controller/userController.js';
import { encrypt } from './middleware/auth.js';
import { favoriteController } from './controller/FavoriteController.js';
import { addNewPlayListToDataBase, getAllPlaylists, getSinglePlaylist, spotifyLoginController, spotifyRefreshController } from './controller/MusicController.js';
import { upload } from './middleware/fileSaver.js';
import { getExercise, getSingleExercise, uploadImage } from './controller/exerciseController.js';
import { addSingleCategory, getAllCategories, getCategoryByType, getSingleCategory } from './controller/categoryController.js';

const PORT = process.env.PORT;
const app = express();


app.use(morgan('dev'));
// app.use(cors({origin: [process.env.FRONTEND_URL], credentials: true}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//User
app.post('/api/register', encrypt, registerUser);
app.post('/api/login', encrypt, loginUser);
app.post('/api/editUser', editUser);

app.post('/api/favorites', favoriteController);

//SPOTIFY API
app.post("/refresh", spotifyRefreshController);
app.post("/login", spotifyLoginController);

//Exercise
app.post("/api/upload", upload.array("image"), uploadImage);
app.get("/api/getexercise", getExercise);
app.get("/api/getsingleexercise/:id", getSingleExercise);
//Categories
app.get("/api/getcategories", getAllCategories);
app.post("/api/getsinglecategory", getSingleCategory);
app.post("/api/createcategory", upload.array("image"), addSingleCategory);
app.post("/api/getcategorybytype", getCategoryByType);

//Music
app.get("/api/getmusicpreview/", addNewPlayListToDataBase);
// app.get("/api/getmusicpreview/:playlistID", getSpotPlayList)
app.get("/api/getallplaylists/", getAllPlaylists);
app.get("/api/getsingleplaylist/:id", getSinglePlaylist);

app.listen(PORT, () => console.log('Server runs on Port:', PORT));
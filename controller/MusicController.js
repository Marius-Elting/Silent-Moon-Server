import SpotifyWebApi from "spotify-web-api-node";
import { getDb } from "../util/db.js";

export const spotifyRefreshController = (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken,
    });

    spotifyApi
        .refreshAccessToken()
        .then(data => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn,
            });
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
};


export const spotifyLoginController = (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    });

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            });
        })
        .catch(err => {
            res.sendStatus(400);
            console.log(err);
        });
};


export const addNewPlayListToDataBase = async (req, res) => {
    const fetchData = async () => {
        const response = await fetch(process.env.RAPIDAPI_LINK + "10498272362", {
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
            }
        });
        const data = await response.json();
        return data;
    };
    let data = await fetchData();
    if (!data.tracks) {
        res.end();
        return;
    }
    const playlistName = data.title;
    const playlistID = data.id;
    const link = data.link;
    const tracks = data.tracks.data;
    const filteredTracks = tracks.filter((el) => el.preview !== "");
    const trackList = filteredTracks.map((track) => {
        const a = {
            title: track.title,
            shortTitle: track.title_short,
            artist: track.artist.name,
            preview: track.preview
        };
        return a;
    });
    // const db = await getDb()
    // db.collection("playlists").insertOne({ link, playlistName, playlistID, trackList, })
    res.json({ link, playlistName, playlistID, trackList, });
};

export const getAllPlaylists = async (req, res) => {
    try {
        const db = await getDb();
        const pointer = await db.collection("playlists").find();
        const data = await pointer.toArray();
        const playlists = data.map((dat) => ({ playlistName: dat.playlistName, playlistID: dat.playlistID }));
        res.status(200).json(playlists);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Database Error" });
    }
};

export const getSinglePlaylist = async (req, res) => {
    console.log(req.params.id);
    try {
        const db = await getDb();
        const pointer = await db.collection("playlists").find({ playlistID: req.params.id });
        const data = await pointer.toArray();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        console.log(err);
        res.status(500).json({ message: "Database Error" });
    }
};
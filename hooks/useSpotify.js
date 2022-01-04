import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil';
import SpotifyWebApi from 'spotify-web-api-node'
import { playlistIdState, playlistsByIdState, playlistsState } from '../atoms/playlistAtom';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import { getTrackInfo } from '../services/services';

const spotify = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
})

function useSpotify() {
    const { data: session } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [playlistId, setPlayListId] = useRecoilState(playlistIdState)
    const [playlistsById, setplaylistsById] = useRecoilState(playlistsByIdState)
    const [playlists, setPlaylists] = useRecoilState(playlistsState);

    useEffect(() => {
        if (session) {
            if (session.error === 'RefreshAccessTokenError') signIn();
            spotify.setAccessToken(session.user.accessToken);
            spotify.setRefreshToken(session.user.refreshToken);
        }
    }, [session])

    const getSpotifyPlayList = () => new Promise((resolve, reject) => {
        if (spotify.getAccessToken() && playlistId) {
            spotify.getPlaylist(playlistId).then((data) => {
                setplaylistsById(data?.body)
                resolve(true);
            }).catch((error) => {
                console.log('Error While Fetching Playlist By Playlist ID', error)
                reject(error);
            })
        }
    })

    const getSpotifyCurrentPlayingTrack = () => new Promise((resolve, reject) => {
        if (spotify.getAccessToken() && !currentTrackId) {
            spotify.getMyCurrentPlayingTrack().then((trackData) => {
                setCurrentTrackId(trackData?.body?.item?.id);
                spotify.getMyCurrentPlaybackState().then((playbackData) => {
                    setIsPlaying(playbackData?.body?.is_playing);
                    resolve(true);
                }).catch((error) => {
                    reject(error);
                })
            }).catch((error) => {
                reject(error);
            })
        }
    })

    const getSpotifyUserPlayList = () => new Promise((resolve, reject) => {
        if (spotify.getAccessToken()) {
            spotify.getUserPlaylists().then((data) => {
                setPlaylists(data?.body?.items)
                if (data?.body?.items?.length > 0) {
                    setPlayListId(data?.body?.items?.[0]?.id)
                }
            }).catch((error) => {
                reject(error)
            })
        }
    })

    const spotifyPlayPauseSong = (songData) => new Promise((resolve, reject) => {
        if (spotify.getAccessToken()) {
            if (currentTrackId === songData?.id && isPlaying) {
                setIsPlaying(false);
                spotify.pause({ uris: [songData?.uri] }).then(() => resolve({ type: 'pause', data: true })).catch(() => reject({ type: 'pause', data: false }));
            } else {
                setCurrentTrackId(songData?.id)
                setIsPlaying(true);
                spotify.play({ uris: [songData?.uri] }).then(() => resolve({ type: 'play', data: true })).catch(() => reject({ type: 'play', data: false }));
            }
        }
    })

    const spotifyPlayerPlayPauseSong = () => new Promise((resolve, reject) => {
        if (spotify.getAccessToken()) {
            spotify.getMyCurrentPlaybackState().then((playbackData) => {
                if (playbackData?.body?.is_playing) { spotify.pause().then(() => resolve({ type: 'pause', data: true })).catch(() => reject({ type: 'pause', data: false })); setIsPlaying(false); }
                else { spotify.play().then(() => resolve({ type: 'play', data: true })).catch(() => reject({ type: 'play', data: false })); setIsPlaying(true); }
            }).catch((error) => {
                reject(error);
            })
        }
    })

    const getSpotifyTrackInfo = () => new Promise(async (resolve, reject) => {
        if (currentTrackId) {
            getTrackInfo(currentTrackId, spotify.getAccessToken()).then((trackInfo) => {
                resolve(trackInfo)
            }).catch((error) => {
                reject(error)
            })
        }
    })

    const spotifySetVolume = (volume) => new Promise((reject) => {
        spotify.setVolume(volume).catch((error) => reject(error))
    });

    return {
        spotify,
        getSpotifyPlayList,
        getSpotifyCurrentPlayingTrack,
        getSpotifyUserPlayList,
        getSpotifyTrackInfo,
        spotifyPlayPauseSong,
        spotifyPlayerPlayPauseSong,
        spotifySetVolume,
    }
}

export default useSpotify

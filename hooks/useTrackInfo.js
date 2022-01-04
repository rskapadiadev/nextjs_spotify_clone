import React from 'react'
import { useEffect, useState } from 'react/cjs/react.development';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from './useSpotify'
import * as services from '../services/services'
function useTrackInfo() {
    const { spotify, getSpotifyTrackInfo } = useSpotify();
    const currentTrackId = useRecoilValue(currentTrackIdState)
    const [trackInfo, setTrackInfo] = useState(null);

    useEffect(() => {
        getSpotifyTrackInfo().then((data) => {
            setTrackInfo(data)
        });
    }, [currentTrackId, spotify])
    return trackInfo;
}

export default useTrackInfo

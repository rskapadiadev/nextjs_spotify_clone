import { useSession } from 'next-auth/react';
import React, { memo, useCallback, useMemo } from 'react'
import { useEffect, useState } from 'react/cjs/react.development';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify';
import useTrackInfo from '../hooks/useTrackInfo';
import { AiFillPlayCircle, AiFillPauseCircle } from 'react-icons/ai'
import { ImPrevious2, ImNext2 } from 'react-icons/im'
import { IoIosRepeat } from 'react-icons/io'
import { IoShuffle } from 'react-icons/io5'
import { ImVolumeLow, ImVolumeMedium, ImVolumeHigh, ImVolumeMute2 } from 'react-icons/im'
import { debounce } from 'lodash';
function Player() {
    const { spotify, getSpotifyCurrentPlayingTrack, spotifyPlayerPlayPauseSong, spotifySetVolume } = useSpotify();
    const isPlaying = useRecoilValue(isPlayingState);
    const { data: session } = useSession();
    const [volume, setVolume] = useState(50)
    const trackInfo = useTrackInfo()

    useEffect(() => {
        getSpotifyCurrentPlayingTrack();
    }, [currentTrackIdState, spotify, session])

    useEffect(() => {
        debounceVolume(volume);
    }, [volume])

    const debounceVolume = useCallback(debounce((volume) => {
        spotifySetVolume(volume);
    }, 500), [])

    const renderVolumeButton = useMemo(() => {
        switch (true) {
            case (volume === 0): return <ImVolumeMute2 />
            case (volume > 0 && volume < 35): return <ImVolumeLow />
            case (volume > 35 && volume < 70): return <ImVolumeMedium />
            case (volume > 70 && volume <= 100): return <ImVolumeHigh />
            default: return <ImVolumeMute2 />
        }
    }, [volume]);

    const onChangeVolume = useCallback((e) => setVolume(e?.target?.value), []);

    return (
        <div className='bg-[#181818] text-xs text-white grid  grid-cols-3 w-screen border-t-[0.1px] border-gray-800 items-center py-3 px-2 md:px-8'>
            {/* Left */}
            <div className='flex items-center space-x-4 overflow-hidden'>
                <img
                    src={trackInfo?.album?.images?.[0]?.url}
                    className='h-10 w-10 hidden md:inline'
                />
                <div className='space-y-1'>
                    <h3 className="truncate">{trackInfo?.name}</h3>
                    <h3 className='text-gray-500 truncate'>{trackInfo?.artists?.[0]?.name}</h3>
                </div>
            </div>
            {/* Center */}
            <div className='flex items-center justify-evenly space-x-2 md:space-x-5'>
                <IoShuffle className='player-button hidden md:inline' />
                <ImPrevious2 className=' player-button' />
                {isPlaying ? <AiFillPauseCircle onClick={spotifyPlayerPlayPauseSong} className='player-button h-10 w-10 text-white' />
                    : <AiFillPlayCircle onClick={spotifyPlayerPlayPauseSong} className='player-button h-10 w-10 text-white' />}
                <ImNext2 className='player-button' />
                <IoIosRepeat className='player-button hidden md:inline' />
            </div>

            {/* Right */}
            <div className='flex items-center justify-end space-x-3 md:space-x-4'>
                <div onClick={() => setVolume(0)}>{renderVolumeButton}</div>
                <input
                    type='range'
                    value={volume}
                    className='w-14 md:w-28'
                    min={0}
                    max={100}
                    onChange={onChangeVolume}
                />
            </div>
        </div>
    )
}

export default memo(Player)

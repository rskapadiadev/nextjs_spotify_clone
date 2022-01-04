import { MusicNoteIcon, PlayIcon } from '@heroicons/react/solid';
import React, { memo } from 'react'
import { millisToMinuitesAndSeconds } from '../helpers/CommonHelpers';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import useSpotify from '../hooks/useSpotify';

function Song({ songData, order }) {
    const { spotifyPlayPauseSong } = useSpotify();
    const currentTrackId = useRecoilValue(currentTrackIdState)
    const isPlaying = useRecoilValue(isPlayingState)

    const onSongPlayPauseClick = () => {
        if (songData) spotifyPlayPauseSong(songData);
    }

    return (
        <div className='grid gap-2 grid-cols-3 text-gray-500 py-2 px-5 hover:bg-[#292929] hover:text-white rounded-lg  group cursor-pointer w-full' onClick={onSongPlayPauseClick}>
            <div className='flex space-x-4 items-center col-span-2 lg:col-span-1'>
                <div className='w-20 max-w-[20px] min-w-[20px] flex items-center justify-center'>
                    {songData?.id === currentTrackId && isPlaying ?
                        <img
                            src='https://open.scdn.co/cdn/images/equaliser-animated-green.f93a2ef4.gif'
                            className='h-4 w-4 group-hover:hidden'
                        /> : <p className='group-hover:hidden'>{order + 1}</p>
                    }
                    <p
                        className='hidden group-hover:block cursor-pointer'>
                        {songData?.id === currentTrackId && isPlaying ? '||' : '▶'}
                    </p>
                </div>
                {songData?.album?.images?.[0]?.url ? (
                    <img
                        src={songData?.album?.images?.[0]?.url}
                        className='h-7 w-7 md:h-10 md:w-10'
                    />
                ) : (
                    <div className='h-10 w-10 shadow-2xl bg-gray-900 flex items-center justify-center'>
                        <MusicNoteIcon className='h-5 w-5 text-white' />
                    </div>
                )}
                <div className='w-full overflow-hidden'>
                    <p className={`w-full text-xs md:text-base font-semibold truncate text-white  ${currentTrackId === songData?.id && isPlaying ? 'text-[#1DB954]' : 'group-hover:text-white'}`} >{songData?.name}</p>
                    <p className='w-full line-clamp-1 text-xs md:text-sm'>{songData?.artists?.[0]?.name}</p>

                </div>
            </div>
            <div className='hidden lg:inline overflow-hidden items-start justify-start px-4 w-full'>
                <p className='w-full truncate'>{songData?.album?.name}</p>
            </div>

            <div className='overflow-hidden flex items-center justify-center w-full'>
                <p className='text-center w-full'>{millisToMinuitesAndSeconds(songData?.duration_ms)}</p>
            </div>
        </div>
    )
}

export default memo(Song);

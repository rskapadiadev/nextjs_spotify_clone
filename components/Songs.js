import React, { memo } from 'react'
import { useRecoilValue } from 'recoil'
import { playlistsByIdState } from '../atoms/playlistAtom';
import Song from './Song';

function Songs() {
    const playlistsById = useRecoilValue(playlistsByIdState)
    return (
        <div className='px-8 text-white flex flex-col space-y-1 pb-28 w-full'>
            {playlistsById?.tracks?.items?.length > 0 ? (
                <>
                    {playlistsById?.tracks?.items?.map((song, songIndex) => (
                        <Song songData={song?.track} order={songIndex} />
                    ))}
                </>
            ) : (
                <p className='text-gray-500 text-center m-10'>No songs are there</p>
            )}

        </div>
    )
}

export default memo(Songs);

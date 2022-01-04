import { ChevronDownIcon, MusicNoteIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistsByIdState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from '../components/Songs'
import * as CommonHelpers from '../helpers/CommonHelpers';
import Image from 'next/image';
// #4B4B4B
const topGradiantColors = [
    'from-indigo-500',
    'from-blue-500',
    'from-green-500',
    'from-red-500',
    'from-yellow-500',
    'from-pink-500',
    'from-purple-500',

]
function Center() {
    const { data: session } = useSession();
    const { spotify, getSpotifyPlayList } = useSpotify();
    const [topGradiantColor, setTopGradiantColor] = useState(topGradiantColors[0])
    const playlistId = useRecoilValue(playlistIdState)
    const playlistsById = useRecoilValue(playlistsByIdState)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getSpotifyPlayList().finally(() => setLoading(false))
    }, [spotify, playlistId])

    useEffect(() => {
        let randomNumber = Math.floor(Math.random() * topGradiantColors.length)
        setTopGradiantColor(topGradiantColors[randomNumber ?? 0])
        window.scroll({top: 0, left: 0, behavior: 'smooth' });
    }, [playlistId])

    
    return (
        <div className=' w-screen h-screen'>
            <header className='absolute top-5 right-8'>
                <div className='flex items-center bg-black/75 space-x-3 rounded-full opacity-90 hover:opacity-80 cursor-pointer p-1 md:pr-2'>
                    <img className='rounded-full h-5 w-5' src={session?.user?.image ?? 'https://i.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY'} alt='' />
                    <h2 className='text-white text-xs font-bold hidden md:inline'>{session?.user?.name}</h2>
                    <ChevronDownIcon className='text-white h-3 w-3 hidden md:inline' />
                </div>
            </header>
            {!loading ? (
                <div className="flex-grow overflow-scroll h-screen w-full  overflow-y-scroll scrollbar-hide bg-[#121212]">
                    <section className={`flex items-end space-x-7 p-8 bg-gradient-to-b ${topGradiantColor}  to-[#121212] pt-[7rem]`}>
                        {playlistsById?.images?.[0]?.url ? (
                            <img className='h:20 w-20 md:h-44 md:w-44 shadow-2xl' src={playlistsById?.images?.[0]?.url} />
                        ) : (
                            <div className='h-44 w-44 shadow-2xl bg-gray-900 flex items-center justify-center'>
                                <MusicNoteIcon className='h-20 w-20 text-white' />
                            </div>
                        )}

                        <div className='space-y-2'>
                            <p className='text-white text-xs'>PLAYLIST</p>
                            <h1 className='line-clamp-2 text-xl md:text-2xl xl:text-3xl font-bold text-white' style={{ letterSpacing: '2px' }}>
                                {playlistsById?.name}
                            </h1>

                            {playlistsById?.description && <div>
                                <span
                                    className='playListDesc text-xs text-gray-400 font-light line-clamp-3 leading-5'
                                    dangerouslySetInnerHTML={{ __html: playlistsById?.description }}
                                />
                                <style jsx="true" global="true">{`.playListDesc a {color: white;}`}</style>
                            </div>}

                            <div className='text-xs text-white flex space-x-2 flex-row items-start sm:flex-row'>
                                <div className='flex items-center justify-center space-x-2'>
                                    <p className='text-gray-400'>by</p>
                                    <h1 className='text-sm font-bold'>{playlistsById?.owner?.display_name}</h1>
                                </div>

                                <div className='hidden md:flex items-center justify-center space-x-2'>
                                    <p>•</p>
                                    <p className='text-gray-400'>{playlistsById?.followers?.total?.toLocaleString()} likes</p>
                                </div>
                                <div className='items-center justify-center space-x-2 hidden md:flex'>
                                    <p>•</p>
                                    <p className='text-gray-400'>{playlistsById?.tracks?.total?.toLocaleString()} songs</p>
                                </div>

                            </div>
                        </div>
                    </section>


                    <div className='flex bg-[#121212]'>
                        <Songs />
                    </div>
                </div>
            ) : (
                <div className='w-full h-full flex justify-center items-start pt-10'>
                    <img className='h-[20%]' src='/assets/images/spotify_loader.svg ' />
                </div>
            )}
        </div>
    )
}

export default Center

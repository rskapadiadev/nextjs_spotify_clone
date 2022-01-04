import React, { useEffect, useState } from "react"
import { HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon, HeartIcon, RssIcon, LogoutIcon } from "@heroicons/react/outline"
import { signOut, useSession } from "next-auth/react"
import useSpotify from "../hooks/useSpotify";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistsState } from '../atoms/playlistAtom'

function Sidebar() {
    const playlists = useRecoilValue(playlistsState);
    const [playlistId, setPlayListId] = useRecoilState(playlistIdState)
    const { getSpotifyUserPlayList } = useSpotify();

    useEffect(() => {
        getSpotifyUserPlayList();
    }, [])

    const onLogoutClick = () => signOut();
    return (
        <div className="text-gray-500 text-xs  h-screen border-r border-gray-900 lg:text-sm sm:max-w-[12rem] lg: max-w-[15rem] hidden md:inline-block">
            <div className="space-y-3 p-4">
                <button className="flex space-x-2 items-center hover:text-white">
                    <HomeIcon className="h-5 w-5" />
                    <p>Home</p>
                </button>

                <button className="flex space-x-2 items-center hover:text-white">
                    <SearchIcon className="h-5 w-5" />
                    <p>Search</p>
                </button>

                <button className="flex space-x-2 items-center hover:text-white">
                    <LibraryIcon className="h-5 w-5" />
                    <p>Your Library</p>
                </button>

                <button className="flex space-x-2 items-center hover:text-white" onClick={onLogoutClick}>
                    <LogoutIcon className="h-5 w-5" />
                    <p>Logout</p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900" />

                <button className="flex space-x-2 items-center hover:text-white">
                    <PlusCircleIcon className="h-5 w-5" />
                    <p>Create Playlist</p>
                </button>

                <button className="flex space-x-2 items-center hover:text-white">
                    <HeartIcon className="h-5 w-5" />
                    <p>Liked Songs </p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900" />
            </div>

            {/* Playlists... */}
            <div className="space-y-3 p-4 overflow-y-scroll h-full ">
                {playlists.map((playlist) => (
                    <p
                        onClick={() => setPlayListId(playlist.id)}
                        key={playlist?.id}
                        className={`cursor-pointer hover:text-white truncate ${playlistId === playlist?.id && 'font-bold text-white'}`}>
                        {playlist?.name}
                    </p>
                ))}
            </div>
        </div>
    )
}

export default Sidebar

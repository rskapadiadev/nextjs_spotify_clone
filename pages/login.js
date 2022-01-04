import React from 'react'
import { getProviders, signIn } from 'next-auth/react';
import spotify from '../lib/spotify';
function Login({ providers }) {
    return (
        <div className="bg-black min-h-screen flex flex-col items-center justify-center">
            <img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="" />
            {Object.values(providers).map((provider) => {
                const onProviderClick = () => {
                    signIn(provider.id, { callbackUrl: '/' })
                }
                return (
                    <div key={provider.name}>
                        <button
                            onClick={onProviderClick}
                            className="p-2 px-5 rounded-full bg-[#18D860] text-white">
                            Login with {provider.name}
                        </button>
                    </div>
                )
            })}
        </div>
    )
}

export default Login

export async function getServerSideProps() {
    const providers = await getProviders()
    return {
        props: {
            providers,
        }
    }
}
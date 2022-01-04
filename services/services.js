import EndPoints from './EndPoints';
import normalAxios from './normalAxios';

export const getServerImagePath = (type, imageName) => `${BASE_URL}/upload/${type}/${imageName}`
export const getRandomImagePath = (size = '400x400') => `https://source.unsplash.com/random/${size}`;

// Get Address From Lat Long
export const getTrackInfo = (currentTrackId, spotifyAccessToken) => {
    return normalAxios.get(`${EndPoints.getTrackInfo}/${currentTrackId}`, {headers: {
        authorization: `Bearer ${spotifyAccessToken}`
    }});
}

export const getFixedNumber = (number, digits) => Math.round(number * (10 ** digits)) / (10 ** digits);

export const getYoutubeId = (uri = "") => {
    if (uri.includes('https://youtu')) {
        const arrUri = uri.split('/'); 
        const lastUri = arrUri[arrUri.length - 1];
        if (lastUri.includes('watch')) {
            return lastUri.split('=')[ lastUri.split('=').length - 1 ];
        }
        return lastUri;
    } else if (uri.includes('video/')) {
        return false;
    }
    return uri;
}
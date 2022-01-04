export const getTextWithEllipsis = (text, length = 100) => {
    if(text?.length < length) return text;
    else return `${text?.slice(0, length)}...`
}

export const millisToMinuitesAndSeconds = (millis) => {
    const minuites = Math.floor(millis / 60000)
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return seconds === 60 ? minuites + 1 + ':00' : minuites + ':' + (seconds < 10 ? '0' : '') + seconds;
}
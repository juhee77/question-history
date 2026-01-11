import LZString from 'lz-string';

// Handle different import behaviors (ESM vs CommonJS)
const lz = LZString.default || LZString;

export const encodeHistory = (history) => {
    try {
        const jsonString = JSON.stringify(history);
        return lz.compressToEncodedURIComponent(jsonString);
    } catch (error) {
        console.error("Encoding failed:", error);
        return "";
    }
};

export const decodeHistory = (encodedString) => {
    if (!encodedString) return [];
    try {
        const jsonString = lz.decompressFromEncodedURIComponent(encodedString);
        if (!jsonString) return [];
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Decoding failed:", error);
        return [];
    }
};

export const getCurrentUrlWithHistory = (history) => {
    const encoded = encodeHistory(history);
    const url = new URL(window.location.href);
    url.searchParams.set('history', encoded);
    return url.toString();
};

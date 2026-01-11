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
    if (!encodedString) return { mode: null, history: [] };
    try {
        const jsonString = lz.decompressFromEncodedURIComponent(encodedString);
        if (!jsonString) return { mode: null, history: [] };

        const parsed = JSON.parse(jsonString);

        // New format: { mode: 'couple', history: [...] }
        if (parsed.mode && Array.isArray(parsed.history)) {
            return parsed;
        }

        // Legacy format: [...] (Array only)
        if (Array.isArray(parsed)) {
            return { mode: null, history: parsed };
        }

        return { mode: null, history: [] };
    } catch (error) {
        console.error("Decoding failed:", error);
        return { mode: null, history: [] };
    }
};

export const getCurrentUrlWithHistory = (history, mode) => {
    // Always save in new format
    const data = { mode, history };
    const encoded = encodeHistory(data);
    const url = new URL(window.location.href);
    url.searchParams.set('history', encoded);
    return url.toString();
};

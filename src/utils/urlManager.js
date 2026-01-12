import LZString from 'lz-string';

// Handle different import behaviors (ESM vs CommonJS)
const lz = LZString.default || LZString;

export const encodeHistory = (history) => {
    try {
        // Optimize: Convert array of objects to array of arrays to save space
        // [q, n, d, a] -> questionId, nickname, date, answer
        const optimizedHistory = history.history.map(item => [
            item.q,
            item.n,
            item.d,
            item.a
        ]);

        const data = {
            m: history.mode, // mode -> m
            h: optimizedHistory // history -> h
        };

        const jsonString = JSON.stringify(data);
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

        // V2 format: { m: 'couple', h: [[q,n,d,a], ...] }
        if (parsed.m && Array.isArray(parsed.h)) {
            const restoredHistory = parsed.h.map(item => ({
                q: item[0],
                n: item[1],
                d: item[2],
                a: item[3]
            }));
            return { mode: parsed.m, history: restoredHistory };
        }

        // V1 format: { mode: 'couple', history: [...] }
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
    // Pass the whole object to encodeHistory to handle structure optimization there
    const data = { mode, history };
    const encoded = encodeHistory(data);
    const url = new URL(window.location.href);
    url.searchParams.set('history', encoded);
    return url.toString();
};

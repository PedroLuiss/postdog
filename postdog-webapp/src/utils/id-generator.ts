
export const generateUniqueId = (): string => {
    const randomPart = Math.random().toString(36).substring(2, 9);
    const timePart = Date.now().toString(36);
    return `${randomPart}-${timePart}`;
};
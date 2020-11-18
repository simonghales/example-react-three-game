export const hexStringToCode = (string: string) => {
    return parseInt(string.replace(/^#/, ""), 16);
};

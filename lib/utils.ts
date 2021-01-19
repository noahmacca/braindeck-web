
export function capitalizeFirst(string) {
    // capitalize css doesn't work for adjacent spans T.T
    return string.charAt(0).toUpperCase() + string.slice(1);
}

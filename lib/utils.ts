
export function compareMaxFavorite(a, b) {
    if (a.maxFavorite < b.maxFavorite) {
        return 1;
    }
    if (a.maxFavorite > b.maxFavorite) {
        return -1;
    }
    return 0;
}

export function compareCountFavorite(a, b) {
    if (a.countFavorite < b.countFavorite) {
        return 1;
    }
    if (a.countFavorite > b.countFavorite) {
        return -1;
    }
    return 0;
}

export function capitalizeFirst(string) {
    // capitalize css doesn't work for adjacent spans T.T
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
export const accessToken = function () {
    return Math.random().toString(36).substr(20) + Date.now().toString(36) + Math.random().toString(36).substr(2);
}
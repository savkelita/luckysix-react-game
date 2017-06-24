export

function getRandom() {
    const min = 1
    const max = 48
    return Math.floor(Math.random() * (max - min)) + min;
}
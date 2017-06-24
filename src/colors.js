export function getColor(ball) {
    const crvene = [1, 9, 17, 25, 33, 41];
    const zelene = [2, 10, 18, 26, 34, 42];
    const plave = [3, 11, 19, 27, 35, 43];
    const ljubicaste = [4, 12, 20, 28, 36, 44];
    const braon = [5, 13, 21, 29, 37, 45];
    const zuta = [6, 14, 22, 30, 38, 46];
    const narandzaste = [7, 15, 23, 31, 39, 47];

    if (crvene.indexOf(ball) !== -1) {
        return "crvena"
    } else if (zelene.indexOf(ball) !== -1) {
        return "zelena"
    } else if (plave.indexOf(ball) !== -1) {
        return "plava"
    } else if (ljubicaste.indexOf(ball) !== -1) {
        return "ljubicasta"
    } else if (braon.indexOf(ball) !== -1) {
        return "braon"
    } else if (zuta.indexOf(ball) !== -1) {
        return "zuta"
    } else if (narandzaste.indexOf(ball) !== -1) {
        return "narandzasta"
    } else {
        return "crna"
    }
}
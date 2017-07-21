// @flow
var self = module.exports = {
    addClass: (draw: Array<number>, number: number): string => {
        if (draw.indexOf(number) !== - 1) {
            return "match animated flash"
        }
        else {
            return "default"
        }
    },
    getRandom: (): number => {
        const min: number = 1;
        const max: number = 48;
        return Math.floor(Math.random() * (max - min)) + min;
    },
    getRandomCombination: (size: number): Array<number> => {
        let random: number = 0;
        let joined: Array<number> = [];

        while (joined.length < size) {
            random = self.getRandom()
            if (joined.indexOf(random) === -1) {
                joined.push(random);
            }
            else {
                random = self.getRandom()
            }
        }
        return joined
    },
    makeCopy: (array: Array<Object>): Array<Object> => {
        return array.map((item) => Object.assign({}, item, { numbers: [].concat(item.numbers) }))
    }
}
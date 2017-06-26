module.exports = {
    // Match items - add class.
    addClass: function (draw, number) {
        if (draw.indexOf(number) !== - 1) {
            return "match animated flash"
        }
        else {
            return ""
        }
    },
    getRandom: function () {
        const min = 1
        const max = 48
        return Math.floor(Math.random() * (max - min)) + min;
    },
    getOdds: function (snumber) { // 6    snumber - 5 = 1
        let odds = [10000, 7500, 5000, 2500, 1000, 500, 300, 200, 150, 100, 90, 80, 70, 60, 50, 40, 30, 25, 20, 15, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

        if (snumber <= 6) { snumber = 0 }
        else { snumber = snumber - 6 }
        return odds[snumber];
    },
    setCredit: function (winners, tickets) {
        for (var d in winners) {
            for (var t in tickets) {
                if (winners[d].id === tickets[t].id) {
                    tickets[t].credit += winners[d].prize
                }
            }
        }
        return tickets
    },
    makeCopy: function(array){
        let copy = array.map((item) => Object.assign({}, item, { numbers: [].concat(item.numbers) }))
        return copy
    }

}
module.exports = {
    // Match items - add class.
    addClass: function(draw, number) {
        if(draw.indexOf(number) !== - 1){
            return "match animated flash"
        }
        else {
            return ""
        }
    },
    getRandom: function() {
        const min = 1
        const max = 48
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
module.exports = {
    getChannel : (src) => {
        if(src) return src.slice(2, -1);
    },
    getRole : (src) => {
        if(src) return src.slice(3, -1);
    },
};
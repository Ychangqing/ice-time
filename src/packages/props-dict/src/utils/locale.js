export default {
    getLocale(type) {
        const data = require(`../locale/${type}`)
        return data.default
    }
}

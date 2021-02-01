import zenLocale from '../utils/locale'

const install = (Vue) => {
    Vue.mixin({
        computed: {
            "$locale": function () {
                return zenLocale.getLocale(this.$store.state.lang || 'en_US')[this.$options.name] || ''
            }
        }
    })
}
export default install

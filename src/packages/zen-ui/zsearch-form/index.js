import zsearchFromComponent from './index.vue'

zsearchFromComponent.install = function (Vue) {
    Vue.component(zsearchFromComponent.name, zsearchFromComponent)
}
export default zsearchFromComponent

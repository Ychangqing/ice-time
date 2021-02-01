import zdetailComponent from './index.vue'

zdetailComponent.install = function (Vue) {
    Vue.component(zdetailComponent.name, zdetailComponent)
}
export default zdetailComponent

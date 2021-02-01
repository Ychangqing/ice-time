import zloadingComponent from './index.vue'

zloadingComponent.install = function (Vue) {
    Vue.component(zloadingComponent.name, zloadingComponent)
}
export default zloadingComponent

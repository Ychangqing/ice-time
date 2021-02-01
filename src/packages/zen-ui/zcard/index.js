import zcardComponent from './index.vue'

zcardComponent.install = function (Vue) {
    Vue.component(zcardComponent.name, zcardComponent)
}
export default zcardComponent

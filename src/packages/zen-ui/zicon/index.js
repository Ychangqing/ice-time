import ziconComponent from './index.vue'

ziconComponent.install = function (Vue) {
    Vue.component(ziconComponent.name, ziconComponent)
}
export default ziconComponent

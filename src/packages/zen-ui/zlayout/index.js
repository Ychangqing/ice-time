import zlayoutComponent from './index.vue'

zlayoutComponent.install = function (Vue) {
    Vue.component(zlayoutComponent.name, zlayoutComponent)
}
export default zlayoutComponent

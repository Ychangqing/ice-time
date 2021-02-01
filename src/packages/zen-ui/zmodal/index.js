import zmodalComponent from './index.vue'
const zmodal = {
    install: function (Vue) {
        Vue.component(zmodalComponent.name, zmodalComponent)
    }
}
export default zmodal

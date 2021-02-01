import azureADComponent from './index.vue'

azureADComponent.install = function (Vue) {
    Vue.component(azureADComponent.name, azureADComponent)
}
export default azureADComponent

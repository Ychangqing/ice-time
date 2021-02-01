import ztableComponent from './index.vue';

ztableComponent.install = function (Vue) {
    Vue.component(ztableComponent.name, ztableComponent);
};

export default ztableComponent;

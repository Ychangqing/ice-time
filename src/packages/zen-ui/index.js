import {
    default as ztable
} from './ztable';
import {
    default as zform
} from './zform';
import {
    default as zicon
} from './zicon';
import {
    default as zlink
} from './zlink';
import {
    default as zdetail
} from './zdetail';
import {
    default as ztab
} from './ztab';
import {
    default as zcard
} from './zcard';
import {
    default as zlayout
} from './zlayout';
import {
    default as zsearchForm
} from './zsearch-form';
import {
    default as zerrorPage
} from './error-page';
import {
    default as zresultPage
} from './result-page';
import {
    default as zmessage
} from './zmessage';
import {
    default as znotification
} from './znotification';

import {
    default as zmodal
} from './zmodal';
import {
    default as zmodalJs
} from './zmodal/modal.js';
import {
    default as azureAD
} from './azureAD';
import {
    default as zloading
} from './zloading';
import {
    default as zsmodal
} from './z-smodal';

import componentsI18n from "./plugins/componentsI18n"

const components = [
    ztable,
    zform,
    zdetail,
    zicon,
    zlink,
    ztab,
    zcard,
    zlayout,
    zsearchForm,
    zerrorPage,
    zresultPage,
    zmodal,
    azureAD,
    zloading,
    zsmodal
];

const install = function (Vue) {
    components.map(component => {
        Vue.use(component);
    });
    Vue.use(componentsI18n)
    Vue.prototype.$zmessage = zmessage;
    Vue.prototype.$znotification = znotification;
    Vue.prototype.$zmodal = zmodalJs
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export {
    install,
    ztable,
    zform,
    zdetail,
    zicon,
    zlink,
    ztab,
    zcard,
    zlayout,
    zsearchForm,
    zerrorPage,
    zresultPage,
    zmessage,
    znotification,
    zmodal,
    azureAD,
    zloading,
    zsmodal
};

export default {
    install,
};

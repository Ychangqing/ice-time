const zenLocale = require('./src/utils/locale');

let locale = zenLocale.default.getLocale(localStorage.getItem("lang") || 'en_US');

const generalModule = [{
    tag: 'name',
    form: {
        type: "input",
        rules: [{
            required: true,
            message: locale["verify.required"]
        }]
    }
}, {
    tag: 'uid',
    form: {
        type: "select",
        options: [],
        rules: [{
            required: true,
            message: locale["verify.required"]
        }]
    }
}, {
    tag: 'description',
    form: {
        type: "textarea",
        rules: [{
            required: true,
            message: locale["verify.required"]
        }, {
            max: 100,
            message: locale["verify.max"]
        },]
    }
}];

const getProps = function (item, wrap) {
    const itemlabel = locale[item.props] || item.props
    let res;
    if (item.tag) {
        const tagModule = JSON.parse(JSON.stringify(generalModule.find((value) => {
            return value.tag == item.tag
        })[wrap]))
        res = Object.assign(tagModule, item)
    } else {
        const propsModule = JSON.parse(JSON.stringify(generalModule.find((value) => {
            return value.tag == item.props
        })));
        if (propsModule) {
            res = Object.assign(propsModule[wrap], item)
        } else {
            const defaultConfig = {
                type: "input",
                rules: [{
                    required: true,
                    message: ""
                }]
            };
            res = Object.assign(defaultConfig, item)
        }
    }
    return Object.assign(res, {
        label: itemlabel
    })
};

const changeLang = function (lang) {
    locale = zenLocale.default.getLocale(lang);
};
// let install = function (vue) {
//     vue.util.defineReactive(this, "xxx", locale)
// }

export default {
    changeLang,
    getProps
};

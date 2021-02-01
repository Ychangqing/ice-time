export default {
    name: 'localeMax',
    getLocale(type) {
        const zcard = require(`../zcard/locale/${type}`)
        const zsearchForm = require(`../zsearch-form/locale/${type}`)
        const zform = require(`../zform/locale/${type}`)
        const ztab = require(`../ztab/locale/${type}`)
        const ZMouseMenu = require(`../ztab/locale/${type}`)
        const customI18n = Object.assign({}, {
            zcard: zcard.default,
            zsearchForm: zsearchForm.default,
            zform: zform.default,
            ztab: ztab.default,
            ZMouseMenu: ZMouseMenu.default
        })
        return customI18n
    }
}

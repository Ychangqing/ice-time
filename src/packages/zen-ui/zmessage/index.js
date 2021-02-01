import Notification from '../base/notification'

let top = 24;
const prefixCls = 'message';
let messageInstance;

function getMessageInstance() {
    messageInstance = messageInstance || Notification.newInstance({
        prefixCls: prefixCls,
        styles: {
            right: 0
        }
    })

    return messageInstance;
}

function notice(content = '', duration = 1.5, type, id, openHandle = function () {}) {
    let iconType = {
        info: 'info-circle',
        success: 'check-circle',
        error: 'close-circle',
        warning: 'exclamation-circle',
        loading: 'loading',
    } [type];

    let instance = getMessageInstance();

    instance.notice({
        prefixCls: prefixCls,
        id: id,
        transitionName: 'zen-' + prefixCls,
        content: content,
        duration: duration,
        openHandle: openHandle,
        icon: iconType,
        type: type,
    })
    return
}

import './style/index.less'

export default {
    name: 'zmessage',
    info(options) {
        return this.message('info', options);
    },
    success(options) {
        return this.message('success', options);
    },
    warning(options) {
        return this.message('warning', options);
    },
    error(options) {
        return this.message('error', options);
    },
    loading(options) {
        return this.message('loading', options);
    },
    message(type, options) {
        if (typeof options === 'string') {
            options = {
                content: options
            };
        }
        return notice(options.content, options.duration, type, options.id, options.openHandle);
    },
    config(options) {
        if (options.top || options.top === 0) {
            defaults.top = options.top;
        }
        if (options.duration || options.duration === 0) {
            defaults.duration = options.duration;
        }
    },
}

import Notification from '../base/notification'

let top = 24;
const prefixCls = 'notification';
let messageInstance;

function getMessageInstance() {
    messageInstance = messageInstance || Notification.newInstance({
        prefixCls: prefixCls,
        styles: {
            top: `${top}px`,
            right: 0
        }
    })

    return messageInstance;
}

function notice(type, option) {
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
        id: option.id,
        transitionName: 'zen-' + prefixCls,
        duration: option.duration,
        openHandle: option.openHandle,
        closeHandle: option.closeHandle,
        icon: iconType,
        type: type,
        message: option.message,
        description: option.description,
        btn: option.btn
    })
    return
}

import './style/index.less';

export default {
    name: 'znotification',
    open(options) {
        return notice('normal', options);
    },
    info(options) {
        return notice('info', options);
    },
    success(options) {
        return notice('success', options);
    },
    warning(options) {
        return notice('warning', options);
    },
    error(options) {
        return notice('error', options);
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

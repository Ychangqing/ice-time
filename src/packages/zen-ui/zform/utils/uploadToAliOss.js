import getEtag from './qetag'
const serverUrl = 'https://codemirror.zen.dev/mongo_api/api/sign'
let accessid = ''
let host = ''
let policy = ''
let signature = ''
let key = ''
let expire = 0
let timestamp = Date.parse(new Date()) / 1000
let now = timestamp
let callbackbody = ''


function send_request() {
    var xmlhttp = null;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (xmlhttp != null) {
        xmlhttp.open("GET", serverUrl, false);
        xmlhttp.send(null);
        return xmlhttp.responseText
    }
    else {
        alert("Your browser does not support XMLHTTP.");
    }
};


function get_signature() {
    now = timestamp = Date.parse(new Date());
    if (expire < now) {
        let body = send_request()
        let obj = eval("(" + body + ")");
        host = obj['host']
        policy = obj['policy']
        accessid = obj['accessid']
        signature = obj['signature']
        expire = parseInt(obj['expire'])
        key = obj['dir']
        callbackbody = obj['callback']

        return true;
    }
    if (expire > now) {
        return true
    }
    return false;
};

function get_suffix(fileName) {
    return '.' + fileName.substr((fileName.lastIndexOf('.') + 1));
}

function get_EtagName(file) {
    return new Promise(function (resolve, reject) {
        try {
            var reader = new FileReader();
            reader.onload = function () {
                resolve(getEtag(this.result))
            }
            reader.readAsArrayBuffer(file);
        } catch (error) {
            reject()
        }
    })

}

export default async function UpladFile(file) {
    let signatureStatus = get_signature()
    if (!signatureStatus || !file) {
        return
    }

    var xmlhttp = null;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (xmlhttp != null) {
        const EtagName = await get_EtagName(file)
        const fileSuffix = get_suffix(file.name);
        const filename = EtagName + fileSuffix
        var url = host;
        var form = new FormData();
        form.append("name", filename);
        form.append("key", 'oss-static/' + filename);
        form.append("policy", policy);
        form.append("OSSAccessKeyId", accessid);
        form.append("success_action_status", '200');
        form.append("callback", callbackbody);
        form.append("signature", signature);
        form.append("file", file);

        const promise = new Promise(function (resolve, reject) {
            const handler = function () {
                if (this.readyState !== 4) {
                    return;
                }
                if (this.status === 200) {
                    return resolve(this.response);
                } else {
                    return reject(new Error(this.statusText));
                }
            };
            let xhr = new XMLHttpRequest();
            xhr.open("post", url, true);
            xhr.onreadystatechange = handler;
            xhr.send(form);
        });

        return promise
    }
    else {
        alert("Your browser does not support XMLHTTP.");
    }

};
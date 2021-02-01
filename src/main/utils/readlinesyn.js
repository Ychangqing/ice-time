const fs = require('fs');

var LineReader = function (path) {
    this._leftOver = '';
    this._EOF = false;
    this._filename;
    this._fd = 0;
    this._bufferSize = 1024;
    this._buffer = new Buffer(this._bufferSize);

    if (undefined !== path) {
        try {
            this.open(path);
        }
        catch (exception) {
            console.log('\033[41;30m commitError', path, '\033[40;31m 无法找到文件！ \n')
            this._EOF = false;
            return;
        }
    }
}

LineReader.prototype.close = function () {
    var self = this;
    try {
        fs.closeSync(self._fd);
    }
    catch (exception) {
        console.log('\033[40;31m closing file failed')
    }
    self._EOF = true;
    self._fd = 0;
    return;
}

LineReader.prototype.next = function () {
    var self = this;
    if (0 == self._fd) {
        return;
    }

    var _idxStart = 0;
    var idx = 0;
    while ((self._leftOver.indexOf('\n', _idxStart)) == -1) {
        var read;
        try {
            read = fs.readSync(self._fd, self._buffer, 0, self._bufferSize, null)
        }
        catch (exception) {
            console.log('\033[40;31m reading file failed')
            self.close();
            return;
        }

        if (read !== 0) {
            self._leftOver += self._buffer.toString('utf8', 0, read);
        } else {
            try {
                fs.closeSync(self._fd);
            }
            catch (exception) {
                console.log('\033[40;31m closing file failed')
            }
            self._EOF = true;
            self._fd = 0;
            return;
        }
    }
    if ((idx = self._leftOver.indexOf('\n', _idxStart)) !== -1) {
        var line = self._leftOver.substring(_idxStart, idx);
        _idxStart = idx + 1;
        self._leftOver = self._leftOver.substring(_idxStart);
        _idxStart = 0;
        return line;
    }
}

LineReader.prototype.open = function (thePath) {
    var self = this;
    self._filename = thePath;
    if (0 !== self._fd) {
        self.close();
    }
    try {
        self._fd = fs.openSync(self._filename, 'r');
        self._fd = fs.openSync(self._filename, 'r');
    }
    catch (exception) {
        console.log('\033[41;30m commitError', self._filename, '\033[40;31m 无法找到文件！ \n')
        self._EOF = true;
        return;
    }

    self._EOF = false;
    return self._fd;
}

module.exports = LineReader;
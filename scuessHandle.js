function sucessHandle(res, code, todos , message , headers) {
    res.writeHead(code, headers);
        res.write(JSON.stringify({
            status: 'scuess',
            message: message,
            data: todos
        }))
        res.end();
}
module.exports = sucessHandle
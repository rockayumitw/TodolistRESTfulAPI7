const http = require('http');
const {v4: uuid4} = require('uuid');
const sucessHandle = require('./scuessHandle.js')
const errorHandle = require('./errorHandle.js')
const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    "Content-Type": "text/json"
}

let todos = [
    {
        id: '01234',
        title: 'test'
    }
]

const requestListener = (req, res) => {
    let body = ''
    req.on('data', chunk => body += chunk)

    if(req.url == '/todos' && req.method == 'GET') {
        sucessHandle(res, 200, todos ,'撈取成功', headers)
    } else if (req.url == '/todos' && req.method == 'DELETE') {
        try {
            todos.length = 0
            sucessHandle(res, 200, todos ,'刪除成功', headers)
        } catch (e) {
            errorHandle(res, 400 , '刪除失敗', headers)
        }
    } else if (req.url == '/todos' && req.method == 'POST') {
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title
                if(title != undefined) {
                    const todo = {
                        title,
                        id: uuid4()
                    }
                    todos.push(todo);
                    sucessHandle(res, 200, todos ,'新增成功', headers)
                } else {
                    errorHandle(res, 400 , '新增失敗', headers)
                }
            } catch (e) {
                errorHandle(res, 400 , '新增失敗', headers)
            }
        })
    } else if (req.url.startsWith('/todos') && req.method == 'PATCH') {
        req.on('end', () => {
            try {  
                const title = JSON.parse(body).title
                const id = req.url.split('/').pop();
                const index = todos.findIndex(a => id == a.id)
                if(title != undefined && index != -1) {
                    todos[index].title = title
                    sucessHandle(res, 200, todos ,'編輯成功', headers)
                } else {
                    errorHandle(res, 400 , '編輯失敗', headers)
                }
            } catch(e) {
                errorHandle(res, 400 , '編輯失敗', headers)
            }
        })
    } else if(req.url.startsWith('/todos') && req.method == 'DELETE') {
        console.log('刪除')
        req.on('end', () =>{
            try{
                const id = req.url.split('/').pop();
                const index = todos.findIndex(a => id == a.id)
                if(index != -1) {
                    todos.splice(index, 1)
                    sucessHandle(res, 200, todos ,'刪除成功', headers)
                } else {
                    errorHandle(res, 400 , '刪除失敗', headers)
                }
            } catch(e) {
                errorHandle(res, 400 , '刪除失敗', headers)
            }
        })
    } else if(req.method == 'OPTIONS') {
        res.writeHead(200, headers);
        res.end();
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            status: 'fail',
            message:'無此頁面'
        }))
        res.end();
    }
    
}

http.createServer(requestListener).listen(process.env.PORT || 3005);
const dotenv=require('dotenv')
dotenv.config()
const port=process.env.PORT;
const http=require('http')

const app=require('./src/api/v1/app')

const server=http.createServer(app)

server.listen(port,()=>{
    console.log(`server is running at port ${port}`)
})

module.exports=server
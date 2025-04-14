const cors=require("cors");
const corsOption={
    origin:"*",
    methods:"GET,HEAD,PUT,DELETE,POST,PATCH",
    allowedHeaders:["content-type","Authorization"],
    credentials:true,
}
module.exports = cors(corsOption)
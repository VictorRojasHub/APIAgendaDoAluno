import express from"express";

const server = express();

server.get("/notes", (req,res) =>{

})


server.post("/notes", (req,res) =>{
    
})


server.put("/notes/:id", (req,res) =>{
    
})


server.delete("/notes/:id", (req,res) =>{
    
})


server.listen(3000, () =>{
    console.log("servidor ativo!!")
});
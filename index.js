const http = require("http");
const fs = require("fs");
const url = require("url");
const {guardarCandidato, getCandidatos, editCandidato, eliminarCandidato, registrarVotos, getHistorial} = require("./consultas");

http.createServer(async (req, res) =>{
    
    if(req.url == "/" && req.method == "GET"){
        fs.readFile("index.html", (err, data) =>{
            if(err){
                res.statusCode = 500;
                res.end();
            }else{
                res.setHeader("content-type", "text/html")
                res.end(data);
            }
        })
    }
    
    if(req.url == "/candidato" && req.method == "POST"){
        let body ="";
        req.on("data", (chunck) =>{
            body = chunck.toString()
        });
        req.on("end", async() =>{
            const candidato = JSON.parse(body)
            try{
                const result = await guardarCandidato(candidato)
                res.statusCode = 201;
                res.end(JSON.stringify(result));
            }catch(e){
                res.statusCode = 500;
                res.end("Ocurrio un dilema en el servidor. " + e);
            }
        });
    }
    
    if(req.url == "/candidatos" && req.method == "GET"){
        try{
            const candidatos = await getCandidatos();
            res.end(JSON.stringify(candidatos));
        }catch(e){
            res.statusCode = 500;
            res.end("Ocurrio un dilema en el servidor. " + e);
        }
    }
    
    if(req.url == "/candidato" && req.method == "PUT"){
        let body ="";
        req.on("data", (chunck) =>{
            body = chunck.toString()
        });
        req.on("end", async() =>{
            const candidato = JSON.parse(body)
            try{
                const result = await editCandidato(candidato)
                res.statusCode = 200;
                res.end(JSON.stringify(result));
            }catch(e){
                res.statusCode = 500;
                res.end("Ocurrio un dilema en el servidor. " + e);
            }
        });
    }
    
    if(req.url.startsWith("/candidato?id") && req.method == "DELETE"){
        try{
            let {id} = url.parse(req.url, true).query;
            await eliminarCandidato(id);
            res.end("Candidato eliminado");
        }catch(e){
            res.statusCode = 500;
            res.end("Ocurrio un dilema en el servidor. " + e);
        }
    }

    if(req.url == "/votos" && req.method == "POST"){
        let body ="";
        req.on("data", (chunck) =>{
            body += chunck.toString();
        });
        req.on("end", async() =>{
            try{
                const voto = JSON.parse(body);
                const result = await registrarVotos(voto);
                res.statusCode = 201;
                res.end(JSON.stringify(result));    
            }catch(e){
                res.statusCode = 500;
                res.end("Ocurrio un dilema en el servidor. " + e);
            }
        })
    }

    if(req.url == "/historial" && req.method == "GET"){
        try{
            const historial = await getHistorial();
            res.end(JSON.stringify(historial));
        }catch(e){
            res.statusCode = 500;
            res.end("Ocurrio un dilema en el servidor. " + e);
        }
    }
})
.listen(3000, () =>{console.log("Puerto conectado")})
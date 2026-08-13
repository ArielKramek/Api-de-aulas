/* 
Instale as bibliotecas e o cliente de API:
npm init
npm i express
Procure pela extensão RapidAPI Client no VSCode.
*/
// Para executar a API no terminal: node index.js
// Link para testar a API: http://localhost:3000/rota
const express = require("express")
const app = express()
const port = 3000
app.use(express.json()) // configura API para usar JSON.
const fs = require('fs') // importa leitura e escrita de arquivos.



//post
app.post("/aulas", (req, res) => {
    const aulas = req.body
    try {
        // abrir o arquivo
        const bd = JSON.parse(fs.readFileSync("bd.json", "utf8"))
        // adicionar o cliente
        bd.push(aulas)
        // salvar o arquivo
        fs.writeFileSync("bd.json", JSON.stringify(bd), "utf8")
        // resposta
        res.status(201).json({resposta: "Aula adicionada!"})
    } catch (erro) {
        res.status(500).json({erro: erro.message})
    }


    //get
})
app.get("/aulas", (req, res) => {
    try {
        const bd = JSON.parse(fs.readFileSync("bd.json", "utf8"))
        res.status(200).json({resposta: bd})
    } catch (erro) {
        res.status(500).json({erro: erro.message})
    }
})

//deletar post

app.delete("/aulas/:id", (req, res) => {
    // pegar o id da rota
    const id = req.params.id
    try {
        // abrir o banco de dados
        const bd = JSON.parse(fs.readFileSync("bd.json", "utf8"))
        // encontrar o índice do cliente a ser excluido
        const indiceAulas = bd.findIndex((aulas) => aulas.id == id)
        // remover o indice da lista
        if (indiceAulas == -1) {
            return res.status(404).json({erro: "O cliente não existe"})
        }
        bd.splice(indiceAulas, 1)
        
        // atualizar o arquivo
        fs.writeFileSync("bd.json", JSON.stringify(bd, null, 2), "utf8")
        // dar uma resposta para o cliente
        res.status(200).json({resposta: "Aula excluída com sucesso!"})
    } catch (error){
        res.status(500).json({erro: erro.message})
    }
})








// Execução da API:
app.listen(port, ()=>{
    console.log("API rodando na porta " + port)
})
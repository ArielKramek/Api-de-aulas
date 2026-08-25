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

let arquivoID = JSON.parse(fs.readFileSync("id.json", "utf8"))
let id = arquivoID.id

function atualizarID(){
    id = id + 1
    fs.writeFileSync("id.json", JSON.stringify({id:id}), "utf8")
}

//post
app.post("/aulas", (req, res) => {
    const aula = req.body
    try {
        // abrir o arquivo
        const bd = JSON.parse(fs.readFileSync("bd.json", "utf8"))
            atualizarID()
            aula.id = id

        // adicionar o cliente
        bd.push(aula)
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




app.get("/aulas/:dia", (req, res) => {
    const dia = req.params.dia
    try {
        const aulas = JSON.parse(fs.readFileSync("bd.json", "utf8"))
        
        // Filtra comparando os dias em minúsculo
        const aulasDia = aulas.filter((aula) => 
            aula.dia && aula.dia.toLowerCase() === dia.toLowerCase()
        );

        if (aulasDia.length === 0) {
            return res.status(404).json({ erro: "nenhuma aula para este dia" })
        }

        aulasDia.sort((a, b) => a.ordem_aula - b.ordem_aula)

        res.status(200).json({ resposta: aulasDia })
    } catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
})





//deletar post

// deletar aula por id
app.delete("/aulas/:id", (req, res) => {
    // Converte o id da URL para Número
    const id = Number(req.params.id)

    try {
        const bd = JSON.parse(fs.readFileSync("bd.json", "utf8"))

        const indiceAula = bd.findIndex((aula) => aula.id === id)

        
        if (indiceAula === -1) {
            return res.status(404).json({ erro: "Aula não encontrada" })
        }
       
        bd.splice(indiceAula, 1)
       
        fs.writeFileSync("bd.json", JSON.stringify(bd, null, 2), "utf8")
        
        res.status(200).json({ resposta: "Aula excluída com sucesso!" })
    } catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
})







// Execução da API:
app.listen(port, ()=>{
    console.log("API rodando na porta " + port)
})
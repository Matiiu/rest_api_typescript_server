import express from 'express'
import colors from 'colors'

import router from './router'
import db from './config/db'

// Connect to db
async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log(colors.bgMagenta.bold('Conexión Exitosa'))
    } catch (error) {
        console.log(
            colors.bgRed.bold('Ocurrio un error al conectar a la base de datos')
        )
        console.error(error)
    }
}
connectDB()

// Instancia de Express
const server = express()

// Leer datos de formulario
server.use(express.json())

server.use('/api', router)

export default server

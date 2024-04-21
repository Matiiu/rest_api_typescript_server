import request from 'supertest'
import server from '../../server'

describe('POST /api/products', () => {
    it('Should display validation errors', async () => {
        const res = await request(server).post('/api/product').send({})

        // What should return
        expect(res.status).toEqual(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(5)

        // What shouldn't return
        expect(res.status).not.toEqual(201)
        expect(res.status).not.toEqual(404)
    })

    it('Should validate that the price is greater than 0', async () => {
        const body = {
            name: 'Monitor Curvo',
            price: -23,
        }

        const res = await request(server).post('/api/product').send(body)

        // What should return
        expect(res.status).toEqual(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe('El precio no es valido')

        // What shouldn't return
        expect(res.status).not.toEqual(201)
        expect(res.status).not.toEqual(404)
    })

    it('Should validate that the price is equal to a numerical value', async () => {
        const body = {
            name: 'Monitor Curvo',
            price: 'Hello World',
        }

        const res = await request(server).post('/api/product').send(body)

        // What should return
        expect(res.status).toEqual(400)
        expect(res.body).toHaveProperty('errors')
        expect(res.body.errors).toHaveLength(2)
        expect(res.body.errors[0].msg).toBe('El precio debe ser un valor numérico')
        expect(res.body.errors[1].msg).toBe('El precio no es valido')

        // What shouldn't return
        expect(res.status).not.toEqual(201)
        expect(res.status).not.toEqual(404)
    })

    it('Should create a new product', async () => {
        const body = {
            name: 'Monitor Curvo - Testing',
            price: 100,
        }

        const res = await request(server).post('/api/product').send(body)

        // What should return
        expect(res.status).toEqual(201)
        expect(res.body).toHaveProperty('data')

        // What shouldn't return
        expect(res.status).not.toBe(400)
        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty('errors')
    })
})

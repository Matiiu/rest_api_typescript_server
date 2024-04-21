import request from 'supertest'
import server from '../server'

describe('GET /api', () => {
    test('Should send back a JSON response', async () => {
        const res = await request(server).get('/api')
        const expectedResponse = {msg: 'From API'}

        // What should return
        expect(res.status).toBe(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual(expectedResponse)

        // What shouldn't return
        expect(res.status).not.toBe(404)
        expect(res.body.msg).not.toBe('from api')
    })
})

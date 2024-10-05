const request = require("supertest");
const app = require("../index");
const cafesJson = require('../cafes.json');

describe("Operaciones CRUD de cafes", () => {
    //requerimiento 1 del desafio: funciona correcto
    it(' status 200 y un array con al menos un objeto ruta GET/cafes', async () => {
        const response = await request(app).get('/cafes');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(typeof response.body[0]).toBe('object');
    });
    //requerimiento 2 del desafio: error en el status code, arroja 400 cuando se esperaba 404
    it('status 404 si se intenta borrar un id que no existe a la ruta /cafes/:id', async () => {
        const nonExistentId = 10000; // ID que no existe en cafes.json
        const response = await request(app).delete(`/cafes/${nonExistentId}`);
        //se utiliza el metodo some para comprobar que al menos 1 id coincida
        const cafeExiste = cafesJson.some(cafe => cafe.id == nonExistentId);
        expect(cafeExiste).toBe(false);
        expect(response.statusCode).toBe(404); // Verificar que devuelva 404
        expect(response.body).toHaveProperty('error', 'Café no encontrado');
    });
     // requerimiento 3 del desafio: Test para agregar un nuevo café y verificar que devuelva 201, funciona correcto
     it('status 201,  debe agregar un nuevo café ', async () => {
        const nuevoCafe = { id: 10, nombre: "Café con mucha azucar" }; // Un nuevo café con un ID único

        const cafeExiste = cafesJson.some(cafe => cafe.id === nuevoCafe.id);
        expect(cafeExiste).toBe(false); // El ID no debe existir antes de añadirlo
        const response = await request(app).post('/cafes').send(nuevoCafe);
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(expect.arrayContaining([nuevoCafe]));
    });

    //requerimiento 4 del desafio: status 400 al enviar un id que no se encuentra en el json,

    it('status 400 si el ID en los parámetros no coincide con el ID en el payload', async () => {
        // primero definiremos el id en el json que si existe, y el id que sera enviado en el payload, deben ser diferentes
        const idInJson = 1
        const idPyload = 2

        const cafeExistente = cafesJson.find(cafe => cafe.id == idInJson);
        expect(cafeExistente).toBeDefined();
        const cafeActualizado = { id: idPyload, nombre: "Cortado" };
        const response = await request(app).put('/cafes/1').send(cafeActualizado);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: "El id del parámetro no coincide con el id del café recibido",});
    });
});

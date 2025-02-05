import request from "supertest";
import app from "./index";
import { IBodyInfosStoreReturn } from "./interfaces/returns/IInfosStore";

const SERVER_URL = "http://localhost:3000/store"

describe("Testando API com Supertest e TypeScript", () => {
    // Definição dos endpoints como constantes
    const GET_ROOT = "/";
    const POST_GET_INFO_STORE = "/store/getInfoStore";

    const mockData = {
        "store_id": 900542505
    }

    describe("GET /", () => {
        it("deve retornar status 200 e 'Hello, world!'", async () => {
            const res = await request(SERVER_URL).get(GET_ROOT);
            expect(res.status).toBe(200);
            // expect(res.text).toBe("Hello, world!");
        });
    });

    describe("POST /getInfoStore", () => {
        it("deve retornar status 200 e um objeto de IBodyInfosStoreReturn", async () => {
            const res: any = await request(SERVER_URL)
                .post("/getInfoStore")
                .send(mockData) // Envie dados conforme necessário

            expect(res.status).toBe(200);
            expect(res.body).toEqual(expect.any(Object));

            const responseData: IBodyInfosStoreReturn = res.body;
            // Validações adicionais dependendo da estrutura de IBodyInfosStoreReturn
            expect(typeof responseData.address).toBe("string"); // Exemplo
            expect(typeof responseData.name).toBe("string"); // Exemplo
            expect(typeof responseData.parent_store_type).toBe("string"); // Exemplo
            expect(typeof responseData.store_id).toBe("number"); // Exemplo
            expect(typeof responseData.store_type).toBe("string"); // Exemplo
        });

    });

    // Testes adicionais podem ser adicionados aqui
});
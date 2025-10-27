import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { PropertyController } from "../web/property_controller";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { PropertyService } from "../../application/services/property_service";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";

const app = express();

let dataSource: DataSource;
let propertyController: PropertyController;
let propertyService: PropertyService;
let propertyRepository: TypeORMPropertyRepository;

app.use(express.json());

beforeAll(async () => {
    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [BookingEntity, PropertyEntity, UserEntity],
        synchronize: true,
        logging: false,
    });

    await dataSource.initialize();

    propertyRepository = new TypeORMPropertyRepository(
        dataSource.getRepository(PropertyEntity),
    );

    propertyService = new PropertyService(
        propertyRepository,
    );

    propertyController = new PropertyController(propertyService);

    app.post("/properties", (req, res, next) => {
        propertyController.createProperty(req, res).catch((err) => next(err));
    });
});

afterAll(async () => {
    await dataSource.destroy();
});

describe("PropertyController", () => {
    beforeAll(async () => {
        const propertyRepo = dataSource.getRepository(PropertyEntity);

        propertyRepo.clear();
    });

    it("deve criar uma propriedade com sucesso", async () => {
        const res = await request(app).post("/properties").send({
            name: "Casa na praia",
            description: "Vista para o mar.",
            maxGuests: 6,
            basePricePerNight: 100 
        });

        expect(res).not.toBeNull();
        expect(res?.status).toBe(201);
        expect(res.body.message).toBe("Property created successfully.");
        expect(res.body.property.name).toBe("Casa na praia");
        expect(res.body.property.description).toBe("Vista para o mar.");
        expect(res.body.property.maxGuests).toBe(6);
        expect(res.body.property.basePricePerNight).toBe(100);
    });

    it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
        const res = await request(app).post("/properties").send({
            description: "Vista para o mar.",
            maxGuests: 6,
            basePricePerNight: 100 
        });

        expect(res).not.toBeNull();
        expect(res?.status).toBe(400);
        expect(res.body.message).toBe("O nome da propriedade é obrigatório.");
    });

    it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo",  async () => {
        let res = await request(app).post("/properties").send({
            name: "Casa na praia",
            description: "Vista para o mar.",
            maxGuests: 0,
            basePricePerNight: 100 
        });
        
        expect(res).not.toBeNull();
        expect(res?.status).toBe(400);
        expect(res.body.message).toBe("A capacidade máxima deve ser maior que zero.");

        res = await request(app).post("/properties").send({
            name: "Casa na praia",
            description: "Vista para o mar.",
            maxGuests: -1,
            basePricePerNight: 100 
        });
        
        expect(res).not.toBeNull();
        expect(res?.status).toBe(400);
        expect(res.body.message).toBe("A capacidade máxima deve ser maior que zero.");
    });

    it("deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
        const res = await request(app).post("/properties").send({
            name: "Casa na praia",
            description: "Vista para o mar.",
            maxGuests: 6,
        });
        
        expect(res).not.toBeNull();
        expect(res?.status).toBe(400);
        expect(res.body.message).toBe("O preço base por noite é obrigatório.");
    });
});
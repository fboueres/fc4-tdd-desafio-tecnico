import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "../mappers/property_mapper";

describe("PropertyMapper", () => {
    it("deve converter PropertyEntity em Property corretamente", () => {
        const entity = new PropertyEntity();
        entity.id = "1";
        entity.name = "Casa na Praia";
        entity.description = "Vista para o mar.";
        entity.maxGuests = 6;
        entity.basePricePerNight = 200;

        const domain = PropertyMapper.toDomain(entity);

        expect(domain).not.toBeNull();
        expect(domain).toBeInstanceOf(Property);
        expect(domain.getId()).toBe(entity.id);
        expect(domain.getName()).toBe(entity.name);
        expect(domain.getDescription()).toBe(entity.description);
        expect(domain.getMaxGuests()).toBe(entity.maxGuests);
        expect(domain.getBasePricePerNight()).toBe(entity.basePricePerNight);
    });

    it("deve converter Property para PropertyEntity corretamente", () => {
        const domain = new Property(
            "1",
            "Casa na Praia",
            "Vista para o mar.",
            6,
            200
        );

        const entity = PropertyMapper.toPersistence(domain);

        expect(entity).not.toBeNull();
        expect(entity).toBeInstanceOf(PropertyEntity);
        expect(entity.id).toBe(domain.getId());
        expect(entity.name).toBe(domain.getName());
        expect(entity.description).toBe(domain.getDescription());
        expect(entity.maxGuests).toBe(domain.getMaxGuests());
        expect(entity.basePricePerNight).toBe(domain.getBasePricePerNight());
    });

    it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
        const entity = new PropertyEntity();

        expect(() => PropertyMapper.toDomain(entity)).toThrow(Error("O nome é obrigatório"))

        entity.name = "Casa na praia";
        entity.maxGuests = 0;

        expect(() => PropertyMapper.toDomain(entity)).toThrow(Error("O número máximo de hóspedes deve ser maior que zero"))

        entity.maxGuests = -1;

        expect(() => PropertyMapper.toDomain(entity)).toThrow(Error("O número máximo de hóspedes deve ser maior que zero"))

    });
});
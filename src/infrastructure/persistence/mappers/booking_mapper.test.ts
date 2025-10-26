import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyEntity } from "../entities/property_entity";
import { UserEntity } from "../entities/user_entity";
import { BookingMapper } from "../mappers/booking_mapper";

describe("BookingMapper", () => {
    it("deve converter BookingEntity em Booking corretamente", () => {
        const dateRange = new DateRange(
            new Date('2024-12-20'),
            new Date('2024-12-25')
        );
        
        const propertyEntity = new PropertyEntity();
        propertyEntity.id = "1";
        propertyEntity.name = "Casa na Praia";
        propertyEntity.description = "Vista para o mar.";
        propertyEntity.maxGuests = 6;
        propertyEntity.basePricePerNight = 200;
    
        const userEntity = new UserEntity();
        userEntity.id = "1";
        userEntity.name = "John Doe";

        const entity = new BookingEntity();
        entity.id = "1";
        entity.property = propertyEntity;
        entity.guest = userEntity;
        entity.startDate = dateRange.getStartDate();
        entity.endDate = dateRange.getEndDate();
        entity.guestCount = 6;
        entity.totalPrice = 200 * 6;

        const domain = BookingMapper.toDomain(entity);

        expect(domain).not.toBeNull();
        expect(domain).toBeInstanceOf(Booking);
        expect(domain.getId()).toBe(entity.id);
        expect(domain.getProperty().getId()).toBe(entity.property.id);
        expect(domain.getUser().getId()).toBe(entity.guest.id);
        expect(domain.getGuestCount()).toBe(entity.guestCount);
        expect(domain.getTotalPrice()).toBe(entity.totalPrice);
    });

    it("deve converter Booking para BookingEntity corretamente", () => {
        const dateRange = new DateRange(
            new Date('2024-12-20'),
            new Date('2024-12-25')
        );

        const property = new Property(
            "1",
            "Casa na Praia",
            "Vista para a praia.",
            6,
            200
        );

        const user = new User(
            "1",
            "John Doe"
        );
        
        const domain = new Booking(
            "1",
            property,
            user,
            dateRange,
            6
        );

        const entity = BookingMapper.toPersistence(domain);

        expect(entity).not.toBeNull();
        expect(entity).toBeInstanceOf(BookingEntity);
        expect(entity.id).toBe(domain.getId());
        expect(entity.property.id).toBe(domain.getProperty().getId());
        expect(entity.guest.id).toBe(domain.getUser().getId());
        expect(entity.startDate).toBe(domain.getDateRange().getStartDate());
        expect(entity.endDate).toBe(domain.getDateRange().getEndDate());
        expect(entity.guestCount).toBe(domain.getGuestCount());
        expect(entity.totalPrice).toBe(domain.getTotalPrice());
        expect(entity.status).toBe(domain.getStatus());
    });

    it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
        const dateRange = new DateRange(
            new Date('2024-12-20'),
            new Date('2024-12-25')
        );
        
        const propertyEntity = new PropertyEntity();
        propertyEntity.id = "1";
        propertyEntity.name = "Casa na Praia";
        propertyEntity.description = "Vista para o mar.";
        propertyEntity.maxGuests = 6;
        propertyEntity.basePricePerNight = 200;
    
        const userEntity = new UserEntity();
        userEntity.id = "1";
        userEntity.name = "John Doe";

        const entity = new BookingEntity();

        expect(() => BookingMapper.toDomain(entity)).toThrow("Cannot read properties of undefined (reading 'id')");

        entity.guest = userEntity;

        expect(() => BookingMapper.toDomain(entity)).toThrow("A data de início e término não podem ser iguais.");

        entity.startDate = dateRange.getStartDate();

        expect(() => BookingMapper.toDomain(entity)).toThrow("Cannot read properties of undefined (reading 'id')");
        
        entity.property = propertyEntity;
        
        expect(() => BookingMapper.toDomain(entity)).toThrow("Cannot read properties of undefined (reading 'getTime')");
    });
});
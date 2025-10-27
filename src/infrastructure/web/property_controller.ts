import { Request, Response } from "express";
import { PropertyService } from "../../application/services/property_service";
import type { CreatePropertyDTO } from "../../application/dtos/create_property_dto";

export class PropertyController {
    private propertyService: PropertyService;

    constructor(propertyService: PropertyService) {
        this.propertyService = propertyService;
    }

    async createProperty(req: Request, res: Response): Promise<Response> {
        try{
            const dto: CreatePropertyDTO = {
                name: req.body.name,
                description: req.body.description,
                maxGuests: req.body.maxGuests,
                basePricePerNight: req.body.basePricePerNight,
            }

            const property =  await this.propertyService.createProperty(dto);

            return res
                .status(201)
                .json({
                    message: "Property created successfully.",
                    property: {
                        id: property.getId(),
                        name: property.getName(),
                        description: property.getDescription(),
                        maxGuests: property.getMaxGuests(),
                        basePricePerNight: property.getBasePricePerNight(),
                    }
                });
        } catch (error: any) {
            let message: string;

            switch(error.message) {
                case "O nome é obrigatório":
                    message = "O nome da propriedade é obrigatório.";
                    break;
                case "O número máximo de hóspedes deve ser maior que zero":
                    message = "A capacidade máxima deve ser maior que zero.";
                    break;
                case "SQLITE_CONSTRAINT: NOT NULL constraint failed: properties.base_price_per_night":
                    message = "O preço base por noite é obrigatório.";
                    break;
                default:
                    message = error.message || "An unexpected error occurred"; 
                    break;
            }
            
            return res
                .status(400)
                .json({ message: message });
        }
    }
}
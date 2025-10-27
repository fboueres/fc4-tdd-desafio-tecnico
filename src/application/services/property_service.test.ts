import { PropertyService } from "./property_service";
import { FakePropertyRepository } from "../../infrastructure/repositories/fake_property_repository";
import { Property } from "../../domain/entities/property";
import { CreatePropertyDTO } from "../dtos/create_property_dto";

describe("PropertyService", () => {
  let propertyService: PropertyService;
  let fakePropertyRepository: FakePropertyRepository;

  beforeEach(() => {
    fakePropertyRepository = new FakePropertyRepository();
    propertyService = new PropertyService(fakePropertyRepository);
  });

  it("deve retornar null quando um ID inválido for passado", async () => {
    const property = await propertyService.findPropertyById("999");
    expect(property).toBeNull();
  });

  it("deve retornar uma propriedade quando um ID váilido for fornecido", async () => {
    const property = await propertyService.findPropertyById("1");
    expect(property).not.toBeNull();
    expect(property?.getId()).toBe("1");
    expect(property?.getName()).toBe("Apartamento");
  });

  it("deve salvar uma nova propriedade com sucesso usando repositorio fake e buscando novamente", async () => {
    const newProperty = new Property(
      "3",
      "Test Property",
      "Test Description",
      4,
      100
    );
    await fakePropertyRepository.save(newProperty);

    const property = await propertyService.findPropertyById("3");
    expect(property).not.toBeNull();
    expect(property?.getId()).toBe("3");
    expect(property?.getName()).toBe("Test Property");
  });

  it("deve criar um usuário com sucesso usando um repositorio fake", async () => {
    const propertyDTO: CreatePropertyDTO = {
      name: "Casa na praia",
      description: "Vista para o mar.",
      maxGuests: 6,
      basePricePerNight: 100,
    };

    const result = await propertyService.createProperty(propertyDTO);

    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(Property);
    expect(result?.getId()).not.toBeNull();
    expect(result?.getName()).toBe(propertyDTO.name);
    expect(result?.getDescription()).toBe(propertyDTO.description);
    expect(result?.getMaxGuests()).toBe(propertyDTO.maxGuests);
    expect(result?.getBasePricePerNight()).toBe(propertyDTO.basePricePerNight);

    const savedProperty = await fakePropertyRepository.findById(result.getId());

    expect(savedProperty).not.toBeNull();
    expect(savedProperty?.getId()).toBe(result.getId());
    expect(savedProperty?.getName()).toBe(result.getName());
    expect(savedProperty?.getDescription()).toBe(result.getDescription());
    expect(savedProperty?.getMaxGuests()).toBe(result.getMaxGuests());
    expect(savedProperty?.getBasePricePerNight()).toBe(result.getBasePricePerNight());
  });
});

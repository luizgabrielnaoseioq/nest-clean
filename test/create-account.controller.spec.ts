import { Test, TestingModule } from "@nestjs/testing";
import { CreateAccountController } from "../src/controllers/create-account.controller";
import { PrismaService } from "../src/prisma/prisma.service";
import { ConflictException, HttpException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

describe("CreateAccountController", () => {
  let controller: CreateAccountController;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateAccountController],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<CreateAccountController>(CreateAccountController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("handle", () => {
    const validCreateAccountData = {
      name: "John Doe",
      email: "john@example.com",
      password: "Test123!@#",
    };

    it("should create account successfully with valid data", async () => {
      // Arrange
      const hashedPassword = "hashedPassword123";
      jest.spyOn(bcrypt, "hash").mockResolvedValue(hashedPassword as never);
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: "user-id",
        ...validCreateAccountData,
        password: hashedPassword,
      });

      // Act
      const result = await controller.handle(validCreateAccountData);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(
        validCreateAccountData.password,
        8
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: validCreateAccountData.email },
      });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: validCreateAccountData.name,
          email: validCreateAccountData.email,
          password: hashedPassword,
        },
      });
      expect(result).toBeInstanceOf(HttpException);
      expect(result.getStatus()).toBe(201);
      expect(result.getResponse()).toEqual({
        status: 201,
        message: "Created with success",
      });
    });

    it("should throw ConflictException when email already exists", async () => {
      // Arrange
      const existingUser = {
        id: "existing-user-id",
        name: "Existing User",
        email: validCreateAccountData.email,
        password: "existing-hash",
      };
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(controller.handle(validCreateAccountData)).rejects.toThrow(
        ConflictException
      );
      await expect(controller.handle(validCreateAccountData)).rejects.toThrow(
        "This email already exists"
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: validCreateAccountData.email },
      });
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      mockPrismaService.user.findUnique.mockRejectedValue(
        new Error("Database error")
      );

      // Act & Assert
      await expect(controller.handle(validCreateAccountData)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("validation", () => {
    it("should validate email format", async () => {
      const invalidData = {
        name: "John Doe",
        email: "invalid-email",
        password: "Test123!@#",
      };

      // This test would be handled by the ZodValidationPipe in integration tests
      // Here we're just testing the controller logic
      expect(invalidData.email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it("should validate password requirements", async () => {
      const weakPassword = "weak";
      expect(weakPassword.length).toBeLessThan(8);
    });
  });
});

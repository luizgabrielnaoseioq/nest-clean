import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { email, z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(32, "Password must be at most 32 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

const emailSchema = z.string().email({ message: "Invalid email" });

const createAccountBodySchema = z.object({
  name: z.string().max(32),
  email: emailSchema,
  password: passwordSchema,
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const hash = await bcrypt.hash(password, 8);

    const userWhithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWhithSameEmail) {
      throw new ConflictException("This email already exists");
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });

    throw new HttpException(
      {
        status: 201,
        message: "Created with success",
      },
      HttpStatus.CREATED
    );
  }
}

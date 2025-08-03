import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { email, z } from "zod";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = createAccountBodySchema.parse(body);

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

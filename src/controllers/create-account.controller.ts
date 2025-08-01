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

@Controller("/accounts")
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, email, password } = body;

    const hash = await bcrypt.hash(password, 8)

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

    throw new HttpException({
      status: 201,
      message: "Created with success",
    }, HttpStatus.CREATED);
  }
}

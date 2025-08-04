import { Controller, Get, HttpCode } from "@nestjs/common";
import { Prisma } from "generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";

@Controller("/accounts")
export class GetAllAccountsController{
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(200)
  async handle(){
    const accounts = this.prisma.user.findMany()

    return accounts
  }
}

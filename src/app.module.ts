import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateAccountController } from './controllers/create-account.controller';
import { GetAllAccounts } from './controllers/get-all-accounts.controller';

@Module({
  controllers: [CreateAccountController, GetAllAccounts],
  providers: [PrismaService],
})
export class AppModule {}

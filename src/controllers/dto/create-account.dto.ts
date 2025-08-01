import { ApiProperty } from '@nestjs/swagger'
import { z } from 'zod'

export class CreateAccountDTO{

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  password: string
}

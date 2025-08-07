import { ZodValidationPipe } from './../../../../infra/http/pipes/zod-validation-pipe';
import { Either, right } from "@/core/either";
import { StudentsRepository } from "../repositories/students-repository";
import { Student } from "../../enterprise/entities/student";

interface CreateStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type CreateStudentUseCaseResponse = Either<
  null,
  {
    student: Student;
  }
>;

export class CreateStudentUseCase {
  constructor(private studentRepository: StudentsRepository) {}

  async execute({ name, email, password }: CreateStudentUseCaseRequest): Promise<CreateStudentUseCaseResponse>{
    const student = Student.create({
      name,
      email,
      password
    })

    await this.studentRepository.create(student)

    return right({
      student,
    })

  }
}

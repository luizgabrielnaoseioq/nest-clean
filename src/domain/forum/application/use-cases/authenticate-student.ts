import { Either, left, right } from "@/core/either";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";
import { Student } from "../../enterprise/entities/student";
import { StudentsRepository } from "../repositories/students-repository";
import { HashGenerator } from "../cryptography/hash-generator";

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

export class AuthenticateStudentUseCase {
  constructor(
    private studentRepository: StudentsRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail =
      await this.studentRepository.findByEmail(email);

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.studentRepository.create(student);

    return right({
      student,
    });
  }
}

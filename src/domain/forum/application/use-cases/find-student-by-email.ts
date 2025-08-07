import { Either, left, Left, right } from "@/core/either";
import { StudentsRepository } from "../repositories/students-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Student } from "../../enterprise/entities/student";

interface StudentEmailRequest {
  email: string;
}

type StudentEmailResponse = Either<ResourceNotFoundError,
  {
    student: Student
  }
>
export class FindStudentByEmailUseCase {
  constructor(private studentRepositorory: StudentsRepository) {}
  async execute ({ email }: StudentEmailRequest): Promise<StudentEmailResponse> {
    const student = await this.studentRepositorory.findByEmail(email)

    if (!student) {
      return left(new ResourceNotFoundError())
    }

    return right({
      student
    })
  }
}

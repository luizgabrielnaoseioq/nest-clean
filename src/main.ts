import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  await app.listen(process.env.PORT ?? 3333);
  const config = new DocumentBuilder()
    .setTitle("Forum")
    .setDescription("Api para fazer perguntas e responder perguntas.")
    .setVersion("1.0")
    .addTag("forum")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);
}
bootstrap();

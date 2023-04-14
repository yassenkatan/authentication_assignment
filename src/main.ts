import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './common/services/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import {
  ResponseFormat,
  ResponseInterceptor,
} from './common/interceptors/response.interceptor';
import { ServerConstantService } from './common/config/server-constant/server-constant.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvironmentConfigService } from './common/config/environment-config/environment-config.service';
import { FileModule } from './common/files/file.module';
import { AdminUserModule } from './user/admin-user.module';
import { AdminAuthModule } from './auth/admin-auth.module';
import { ClientAuthModule } from './auth/client-auth.module';
import { ClientUserModule } from './user/client-user.module';
import { AdminProductModule } from './product/admin-product.module';
import { ClientProductModule } from './product/client-product.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConstant = app.get<ServerConstantService>(ServerConstantService);
  const configService = app.get<EnvironmentConfigService>(
    EnvironmentConfigService,
  );

  // Cors
  app.enableCors();

  // DB
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  // interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // base routing
  app.setGlobalPrefix(serverConstant.getGenericUrlPrefix());

  // swagger config
  const dashboardUrl = `/${serverConstant.getGenericUrlPrefix()}/dashboard/api-docs`;
  const clientUrl = `/${serverConstant.getGenericUrlPrefix()}/client/api-docs`;

  const dashboardConfig = new DocumentBuilder()

    .setTitle('Yassin Kattan Assignment - Dashboard Docs API')
    .setDescription('Documents for dashboard endpoints ...')
    .setVersion('1.0')
    .addBearerAuth()
    .setTitle('Yassin Kattan Assignment')
    .build();

  const clientConfig = new DocumentBuilder()

    .setTitle('Yassin Kattan Assignment - Client Docs API')
    .setDescription('Documents for client endpoints ...')
    .setVersion('1.0')
    .addBearerAuth()
    .setTitle('Yassin Kattan Assignment')
    .build();

  const dashboardDocument = SwaggerModule.createDocument(app, dashboardConfig, {
    include: [FileModule, AdminUserModule, AdminProductModule, AdminAuthModule],
    extraModels: [ResponseFormat],
    deepScanRoutes: true,
  });

  const clientDocument = SwaggerModule.createDocument(app, clientConfig, {
    include: [
      FileModule,
      ClientAuthModule,
      ClientUserModule,
      ClientProductModule,
    ],
    extraModels: [ResponseFormat],
    deepScanRoutes: true,
  });

  SwaggerModule.setup(dashboardUrl, app, dashboardDocument, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  SwaggerModule.setup(clientUrl, app, clientDocument, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(configService.getServerPort(), () => {
    console.log(`\nServer Running on ${serverConstant.getBaseUrl()}\n
      API Documentation For Dashboard Running on ${serverConstant.getBaseUrl()}/${serverConstant.getGenericUrlPrefix()}/dashboard/api-docs\n
      API Documentation For Client Running on ${serverConstant.getBaseUrl()}/${serverConstant.getGenericUrlPrefix()}/client/api-docs`);
  });
}

bootstrap();

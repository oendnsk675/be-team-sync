import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response/response.interceptor';
import { CustomBadGatewayExceptionFilter } from './common/filters/bad-gateway-exception.filter';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new CustomBadGatewayExceptionFilter());

  app.useWebSocketAdapter(new IoAdapter(app));

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
}
bootstrap();

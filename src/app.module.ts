import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { RetoolService } from './retool.service';

@Module({
  imports: [],
  providers: [AppService, RetoolService],
})
export class AppModule {}

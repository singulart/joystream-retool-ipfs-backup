import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

const logger = new Logger('ReTool');

@Injectable()
export class RetoolService {
  async downloadData(): Promise<string> {
      logger.log('Downloading data from ReTool');
      return 'Hello World!';
  }
}


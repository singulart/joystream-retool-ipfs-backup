import { Inject, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { RetoolService } from './retool.service';

const logger = new Logger('joystream-retool-ipfs-backup');

@Injectable()
export class AppService {
  constructor(
    private readonly retoolService: RetoolService,
  ) { }
  
  async pushToIpfs(): Promise<string> {
    await this.retoolService.downloadData();
    logger.debug('Done');
    
    return 'Hello World!';
  }
}

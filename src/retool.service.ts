import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { usersListQuery } from './queries';
import { IPersonExplorerSearch } from './types';
import { spawn, Pool, Worker } from "threads";
import * as moment from 'moment';

const logger = new Logger('ReTool');
axiosRetry(axios, { retries: 3, retryCondition: (_error) => true });
const pool = Pool(() => spawn(new Worker("./workers/download")), 8 /* optional size */);

@Injectable()
export class RetoolService {
  async downloadData(): Promise<string> {
    logger.log('Downloading data from ReTool');
    const response = await axios.post(
      'https://joystream.retool.com/api/public/9478bcc0-f6d6-4f74-bd0a-0637535e75b1/query?queryName=PersonExplorerSearch', 
      usersListQuery()
    );
    const responseData: IPersonExplorerSearch = response.data;
    const taskNumber = responseData.personid.length;
    logger.debug(`Downloading ${taskNumber} users data...`);
    const formattedDate = moment(new Date()).format('DD-MMM-YYYY');
    var i;
    for (i = 1; i <= taskNumber; i++) {
      pool.queue( async download => {
        await download(responseData.personid.pop(), taskNumber, formattedDate);
      });
    }
    await pool.completed();
    await pool.terminate();    
    return 'done!';
  }
}


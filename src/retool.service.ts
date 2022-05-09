import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import Axios from 'axios';
import { userDataQuery, usersListQuery } from './queries';
import { IPersonExplorerSearch, ISelectAllPersonID } from './types';
const logger = new Logger('ReTool');

@Injectable()
export class RetoolService {
  async downloadData(): Promise<string> {
    logger.log('Downloading data from ReTool');
    const response = await Axios.post('https://joystream.retool.com/api/public/9478bcc0-f6d6-4f74-bd0a-0637535e75b1/query?queryName=PersonExplorerSearch', 
      usersListQuery());
    const responseData: IPersonExplorerSearch = response.data;
    logger.debug(`Downloading ${responseData.personid.length} users data...`);
    var i;
    for (i = 1; i <= responseData.personid.length; i++) {
      const personDataResponse: ISelectAllPersonID = (await Axios.post('https://joystream.retool.com/api/public/3ef6f2ee-7d4d-4437-b5f6-f59c8cb17ff6/query?queryName=SelectAllPersonID', 
        userDataQuery(responseData.personid[i]))).data;
      logger.debug(`User ID=[${personDataResponse.memberid[0]}] handle=[${personDataResponse.memberhandle[0]}]`);
    }
    return 'Hello World!';
  }
}


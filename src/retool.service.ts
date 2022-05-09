import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { userDataQuery, userRewardsQuery, usersListQuery } from './queries';
import { IPersonExplorerSearch, ISelectAllPersonID } from './types';
import * as moment from 'moment';
import { writeFileSync } from 'fs';

const logger = new Logger('ReTool');
axiosRetry(axios, { retries: 3, retryCondition: (_error) => true });

@Injectable()
export class RetoolService {
  async downloadData(): Promise<string> {
    logger.log('Downloading data from ReTool');
    const response = await axios.post('https://joystream.retool.com/api/public/9478bcc0-f6d6-4f74-bd0a-0637535e75b1/query?queryName=PersonExplorerSearch', 
      usersListQuery());
    const responseData: IPersonExplorerSearch = response.data;
    logger.debug(`Downloading ${responseData.personid.length} users data...`);
    
    var i;
    for (i = 1; i <= responseData.personid.length; i++) {
      
      const personDataResponse: ISelectAllPersonID = (await axios.post('https://joystream.retool.com/api/public/3ef6f2ee-7d4d-4437-b5f6-f59c8cb17ff6/query?queryName=SelectAllPersonID', 
        userDataQuery(responseData.personid[i]))).data;
      logger.debug(`[${i}/${responseData.personid.length}] User ID=[${personDataResponse.memberid[0]}] handle=[${personDataResponse.memberhandle[0]}]`);
      
      const rewardsBreakdown = await axios.post('https://joystream.retool.com/api/public/3ef6f2ee-7d4d-4437-b5f6-f59c8cb17ff6/query?queryName=RewardedActivityForTags', 
        userRewardsQuery(personDataResponse.id[0]));

      const formattedDate = (moment(new Date())).format('DD-MMM-YYYY');
      const filename = `${personDataResponse.memberid[0]}_${personDataResponse.memberhandle[0]}_${formattedDate}.json`;
      writeFileSync(`./retool/${filename}`, JSON.stringify(rewardsBreakdown.data, null, 2));
    }
    
    return 'done!';
  }
}


import { Logger } from "@nestjs/common";
import { writeFileSync } from "fs";
import { userDataQuery, userRewardsQuery } from "src/queries";
import { IPersonExplorerSearch, ISelectAllPersonID } from "src/types";
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { expose } from "threads/worker";


const logger = new Logger('ReTool');
axiosRetry(axios, { retries: 3, retryCondition: (_error) => true });

export const download = async (personid: number, taskNumber: number, responseData: IPersonExplorerSearch, formattedDate: string) => {

  const personDataResponse: ISelectAllPersonID = (await axios.post('https://joystream.retool.com/api/public/3ef6f2ee-7d4d-4437-b5f6-f59c8cb17ff6/query?queryName=SelectAllPersonID',
    userDataQuery(personid))).data;
  logger.debug(`[${personid}/${taskNumber}] User ID=[${personDataResponse.memberid[0]}] handle=[${personDataResponse.memberhandle[0]}]`);

  const rewardsBreakdown = await axios.post('https://joystream.retool.com/api/public/3ef6f2ee-7d4d-4437-b5f6-f59c8cb17ff6/query?queryName=RewardedActivityForTags',
    userRewardsQuery(personDataResponse.id[0]));

  const filename = `${personDataResponse.memberid[0]}_${personDataResponse.memberhandle[0]}_${formattedDate}.json`;
  writeFileSync(`./retool/${filename}`, JSON.stringify(rewardsBreakdown.data, null, 2));

}

expose(download)
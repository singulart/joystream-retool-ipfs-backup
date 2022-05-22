import { Inject, Injectable } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import { RetoolService } from './retool.service'
import { Web3Storage } from 'web3.storage'
import { CarReader } from '@ipld/car'
import { encode } from 'multiformats/block'
import * as cbor from '@ipld/dag-cbor'
import { sha256 } from 'multiformats/hashes/sha2'
// import { importer } from 'ipfs-unixfs-importer'
// import { MemoryBlockStore } from 'ipfs-car/blockstore/memory'
import { Block } from '@ipld/car/api'
import { CID } from 'multiformats'
import * as fs from "fs";


const logger = new Logger('joystream-retool-ipfs-backup');
const downloadFolder = 'retool';

@Injectable()
export class AppService {
  constructor(
    private readonly retoolService: RetoolService,
  ) { }
  
  pushToIpfs = async () => {
    // await this.retoolService.downloadData();
  
    fs.readdirSync(downloadFolder).filter(file => file.endsWith('json')).forEach(async (file) => {
      const retoolJson = JSON.parse(fs.readFileSync(`${downloadFolder}/${file}`, {encoding: 'utf8', flag:'r'}));
      if(!retoolJson.tjoyearned[0] || !retoolJson.joyearnedpercent[0]) {
        return;
      }
      const block = await this.encodeCborBlock(retoolJson);
      const car = await this.makeCar(block.cid, [block]);
      const client = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
      let cid = null;
      while (!cid) {
        try {
          cid = await client.putCar(car, {name: file});
          logger.log(`🎉 Done storing Joystream Retool data as CBOR object. CID: ${cid}`);
          // logger.log(`💡 If you have ipfs installed, try: ipfs dag get ${cid}\n`);
        } catch (error) {
          logger.error(error);
          await this.delay(30000); // rate limit cool down period is 30 seconds
        }
      }
    });
  }

  encodeCborBlock = async (value: any) => {
    return encode({ value, codec: cbor, hasher: sha256 });
  }

  makeCar = async (rootCID: CID, ipldBlocks: Block[]) => {
    return new CarReader(1, [rootCID], ipldBlocks)
  }
  
  delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
}

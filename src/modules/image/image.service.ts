import { Injectable } from '@nestjs/common';
import imageseg20191230, * as $imageseg20191230 from '@alicloud/imageseg20191230';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import axios from 'axios';
import * as fs from 'fs';
import { createFolder } from 'src/utils';
import * as admZip from 'adm-zip';
import { globSync } from 'glob';

function getPaths() {
  const path = `${__dirname}/../imgfrom`;
  const arr = globSync(`${path}/**/*.{png,jpeg,jpg}`);
  console.log(arr, arr.length);
  return arr;
}

const { STS } = require('ali-oss');
@Injectable()
export class ImageService {
  getHello1(): string {
    return 'iamge kingdom';
  }
  async sts(): Promise<Object> {
    let sts = new STS({

    });
    const info = await sts.assumeRole(
      'acs:ram::1130971307921211:role/ramoss',
      ``,
      '3600',
      'SessionTest',
    );

    return info;
  }
  async imageGen(data) {
    const randomNumbe = Date.now() + Math.random();
    // fetch
    const file: any = this.fetchFile(
      data?.url ||
        'https://thkj-intel.oss-cn-beijing.aliyuncs.com/files/1712634686599_6090325a.jpg',
      data?.fileName || 'test.jpg',
      randomNumbe,
    );

    return file;
  }
  private async unzip(inPath, outPath) {
    const zip = new admZip(inPath);
    zip.extractAllTo(outPath, true);
  }
  private async fetchFile(url, fileName, randomNumbe) {
    const path = `IMAGESET/${randomNumbe}`;
    createFolder(path);
    let { data, headers, ...all } = await axios({
      url: url,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer',
    });
    // const { data } = result;
    await fs.promises.writeFile(`${path}/${fileName}`, data, 'binary');
    return {
      path,
      isImage: ['image/jpeg', 'image/png', 'image/jpg'].includes(
        headers['content-type'],
      ),
      contentType: headers['content-type'],
    };
  }

  private async compress() {}

  static createClient(
    accessKeyId: string,
    accessKeySecret: string,
  ): imageseg20191230 {
    let config = new $OpenApi.Config({
      // 必填，您的 AccessKey ID
      accessKeyId: accessKeyId,
      // 必填，您的 AccessKey Secret
      accessKeySecret: accessKeySecret,
    });
    // Endpoint 请参考 https://api.aliyun.com/product/imageseg
    config.endpoint = `imageseg.cn-shanghai.aliyuncs.com`;
    return new imageseg20191230(config);
  }

  static async main(): Promise<void> {
    // 请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID 和 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
    // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html
    let client = this.createClient(
      'AAnRUNkmilVE3ttJ',
      'zo8msE8vAfdl1NDARN9oN74FaL4ZjR',
    );
    const pathArr = getPaths();

    async function segment(index, pathArr: any) {
      if (index === pathArr.length) return;
      const localPath = pathArr[index];
      // const url = new URL(
      //   "https://nxhl-image.oss-cn-beijing.aliyuncs.com/WechatIMG1.jpeg"
      // );
      // const httpClient = url.protocol == "https:" ? https : http;

      let segmentCommodityRequest =
        new $imageseg20191230.SegmentCommonImageAdvanceRequest();

      segmentCommodityRequest.imageURLObject = createReadStream(localPath);
      segmentCommodityRequest.returnForm = 'whiteBK';
      let runtime = new $Util.RuntimeOptions({});

      let resp = await client.segmentCommodityAdvance(
        segmentCommodityRequest,
        runtime,
      );

      http.get(resp.body.data.imageURL, (res) => {
        //用来存储图片二进制编码
        let imgData = '';

        //设置图片编码格式
        res.setEncoding('binary');

        //检测请求的数据
        res.on('data', (chunk) => {
          imgData += chunk;
        });

        //请求完成执行的回调
        res.on('end', () => {
          // 通过文件流操作保存图片
          writeFile(localPath, imgData, 'binary', (error) => {
            if (error) {
              console.log('下载失败');
            } else {
              console.log('下载成功！');
            }
          });
        });
      });

      segment(index + 1, pathArr);
    }

    segment(0, pathArr);
  }

  private async gen() {}
}

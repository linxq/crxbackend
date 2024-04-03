import { Injectable } from '@nestjs/common';
const { STS } = require('ali-oss');
@Injectable()
export class ImageService {
  getHello1(): string {
    return 'iamge kingdom';
  }
  async sts(): Promise<Object> {
    let sts = new STS({
      accessKeyId: 'LTAI5tHi8sySkUKDSSaoFyiJ',
      accessKeySecret: 'UBCn0kytUsM7AhZPVRf36nMQMy2hih',
    });
    const info = await sts.assumeRole(
      'acs:ram::1130971307921211:role/oss',
      `{
        "Version": "1",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "oss:*"
            ],
            "Resource": [
              "acs:oss:*:*:thkj-intel"
            ],
            "Condition": {}
          }
        ]
      }`,
      '3600',
      'SessionTest',
    );
    console.log('🚀 ~ ImageService ~ sts ~ info:', info);

    return info;
  }
}

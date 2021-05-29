import { AWSError, SES } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AttenderType, MessageType } from '../../shared';

interface ComputeAttenderDisplayName {
  ({ givenName, familyName }: { givenName: string; familyName: string }): string;
}

const computeAttenderDisplayName: ComputeAttenderDisplayName = ({ givenName, familyName }) => {
  const _givenName = givenName.toUpperCase()[0] + givenName.toLowerCase().slice(1);
  const _familyName = familyName.toUpperCase()[0] + familyName.toLowerCase().slice(1);
  return `${_givenName} ${_familyName}`;
};

const ses = new SES({ region: 'eu-west-1' });

type SendEmailOptions = {
  destinationEmail: string;
  fromUser: AttenderType;
  message: MessageType;
};

interface SendEmail {
  (sendEmailOptions: SendEmailOptions): Promise<PromiseResult<SES.SendEmailResponse, AWSError>>;
}

const sendEmail: SendEmail = async ({ destinationEmail, fromUser, message }) => {
  const data: { [key: string]: string } = {
    name: computeAttenderDisplayName(fromUser),
    picture: fromUser.picture,
    message: message.data,
  };

  const htmlEmail = (await fs.readFile(path.resolve(__dirname, 'email.html')))
    .toString()
    .replace(/{{(\w+)}}/g, (match, parameter) => data[parameter]);
  const textEmail = (await fs.readFile(path.resolve(__dirname, './email.txt')))
    .toString()
    .replace(/{{(\w+)}}/g, (match, parameter) => data[parameter]);

  const params: SES.SendEmailRequest = {
    Source: 'notifications-no-reply@think-in.me',
    Destination: { ToAddresses: [destinationEmail] },
    Message: {
      Subject: { Data: `${data.name} has just sent you a message on think-in` },
      Body: { Html: { Data: htmlEmail }, Text: { Data: textEmail } },
    },
  };

  return ses.sendEmail(params).promise();
};

export { sendEmail };

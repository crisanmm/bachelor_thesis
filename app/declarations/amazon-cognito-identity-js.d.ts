import 'amazon-cognito-identity-js';

declare module 'amazon-cognito-identity-js' {
  export interface CognitoUserAttribute {
    Name: string;
    Value: string;

    public getValue?(): string;
    public setValue?(value: string): CognitoUserAttribute;
    public getName?(): string;
    public setName?(name: string): CognitoUserAttribute;
    public toString?(): string;
    public toJSON?(): Object;
  }
}

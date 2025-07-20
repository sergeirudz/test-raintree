import { Construct } from 'constructs';
import { CognitoAuth, CognitoAuthProps } from './cognito';

export function createCognitoAuth(
  scope: Construct,
  props?: CognitoAuthProps
): CognitoAuth {
  return new CognitoAuth(scope, 'CognitoAuth', props);
}

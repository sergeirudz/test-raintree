# CDK commands

```sh
# Init
cdk init app --language typescript 

# Generate a CloudFormation template
# Will generate JSON from TS code
cdk synth

# Boostrap. Run once. Create CloudFormation stack in AWS
cdk bootstrap

cdk deploy # Redeploy when stack updated
cdk deploy InfraStack
cdk list
cdk destroy
cdk doctor # If there are problems 
```

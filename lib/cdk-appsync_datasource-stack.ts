import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as lambda from "@aws-cdk/aws-lambda";

export class CdkAppsyncDatasourceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "GRAPHQL_API", {
      name: "cdk-api",
      schema: appsync.Schema.fromAsset("graphql/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
    });

    new cdk.CfnOutput(this, "APIGraphQlURL", {
      value: api.graphqlUrl,
    });

    ///Print API Key on console after deploy
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });

    const lambda_function = new lambda.Function(this, "LambdaFunction", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "index.handler",
      timeout: cdk.Duration.seconds(10),
    });

    ///Set lambda as a datasource
    const lambda_data_source = api.addLambdaDataSource(
      "lamdaDataSource",
      lambda_function
    );

    ///Describing resolver for datasource
    lambda_data_source.createResolver({
      typeName: "Query",
      fieldName: "hello",
    });

    lambda_data_source.createResolver({
      typeName: "Query",
      fieldName: "myCustomMessage",
    });
  }
}

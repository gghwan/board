import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import dotenv from 'dotenv';

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION
});

const tableName = "BoardPosts";

async function checkTableExists() {
  try {
    const command = new DescribeTableCommand({ TableName: tableName });
    await client.send(command);
    return true;
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      return false;
    }
    throw error;
  }
}

async function createTable() {
  try {
    const exists = await checkTableExists();
    if (exists) {
      console.log(`테이블 '${tableName}'이(가) 이미 존재합니다.`);
      return;
    }

    const command = new CreateTableCommand({
      TableName: tableName,
      KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },
        { AttributeName: "createdAt", KeyType: "RANGE" }
      ],
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "createdAt", AttributeType: "S" },
        { AttributeName: "authorId", AttributeType: "S" },
        { AttributeName: "category", AttributeType: "S" }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "AuthorIndex",
          KeySchema: [
            { AttributeName: "authorId", KeyType: "HASH" },
            { AttributeName: "createdAt", KeyType: "RANGE" }
          ],
          Projection: { ProjectionType: "ALL" },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        },
        {
          IndexName: "CategoryIndex",
          KeySchema: [
            { AttributeName: "category", KeyType: "HASH" },
            { AttributeName: "createdAt", KeyType: "RANGE" }
          ],
          Projection: { ProjectionType: "ALL" },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    });

    const response = await client.send(command);
    console.log(`테이블 '${tableName}'이(가) 성공적으로 생성되었습니다:`, response);
  } catch (error) {
    console.error("테이블 생성 중 오류 발생:", error);
  }
}

createTable();
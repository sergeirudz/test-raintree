import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
type TableProps = {
    tableName: string;
};
export declare const createTable: (scope: Construct, props: TableProps) => Table;
export {};

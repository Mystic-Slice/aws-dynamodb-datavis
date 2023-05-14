import { docClient } from './dynamodb';

export const scanTable = async (tableName: string) => {
    console.log(tableName)
    const params = {
        TableName: tableName,
    } as any;

    const scanResults = [] as any[];
    let items;
    do{
        items = await docClient.scan(params).promise();
        items.Items?.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while(typeof items.LastEvaluatedKey !== "undefined");
    return scanResults;
};

export const putItem = async (tableName: string, item: any) => {
    const params = {
        TableName: tableName,
        Item: item
    };

    const data = await docClient.put(params, (err, data) => {
        return data
    });
    return data;
}

export const putRandomItems = async (tableName: string, sensors: string[], itemsPerSensor: number) => {
    for (let i = 0; i < itemsPerSensor; i++) {
        sensors.forEach(async (sensor) => {
            const item = {
                time: Date.now(),
                sensor: sensor,
                value: Math.random() * 100
            };
            await putItem(tableName, item);
        });
    }
    return true;
}

export const getTimeSensorData = async (tableName: string, time: number, sensor: string) => {
    const params = {
        TableName: tableName,
        Key: {
            time: time as number,
            sensor: sensor as string
        }
    };

    const data = await docClient.get(params, (err, data) => {
        return data
    });
    return data;
}

export const nukeTable = async (tableName: string) => {
    const items = await scanTable(tableName);
    items.forEach(async (item) => {
        const params = {
            TableName: tableName,
            Key: {
                time: item.time,
                sensor: item.sensor
            }
        };
        await docClient.delete(params, (err, data) => {
            return data
        });
    });
    return true;
}

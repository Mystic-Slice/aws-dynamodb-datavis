import { get } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { env } from '~/env.mjs';
import { scanTable, getTimeSensorData, putRandomItems, nukeTable } from '~/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Check error in request
    if(!req.body) {
        res.statusCode = 404
        res.end("Error")
        return
    }

    if (req.body.type == "ALL_DATA") {
        const items = await scanTable(env.TABLE_NAME);
        res.status(200).json(items);
    } else if (req.body.type == "TIME_SENSOR_DATA") {
        const items = await getTimeSensorData(env.TABLE_NAME, req.body.time, req.body.sensor);
        res.status(200).json(items);
    } else if (req.body.type == "POPULATE_DB") {
        const status = await putRandomItems(env.TABLE_NAME, req.body.sensors, req.body.itemsPerSensor as number);
        res.status(200).json({ message: "Populated DB" });
    } else if (req.body.type == "NUKE_DB") {
        const status = await nukeTable(env.TABLE_NAME);
        res.status(200).json({ message: "Nuked DB" });
    }
}
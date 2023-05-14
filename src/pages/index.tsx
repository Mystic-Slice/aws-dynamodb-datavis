import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiReq } from "~/server/utils";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Graph = () => {
    // Array of items with form
    // [sensorName, dataArray]
    // eg: ["temp", [1,2,3,4,5],
    //      "humidity", [1,2,3,4,5]]

    const [graphData, setGraphData] = useState([] as any[]);
    const [refreshing, setRefreshing] = useState({
        value: false,
        message: "",
    });

    useEffect(() => {
        refreshGraph()
    }, []);

    const refreshGraph = async () => {
        console.log("Refreshing graph");
        setRefreshing({
            value: true,
            message: "Refreshing...",
        });
        const items = await apiReq("data", {
            type: 'ALL_DATA',
        }) as any[];
        
        const sensors = items.map((item) => item.sensor);
        const uniqueSensors = [...new Set(sensors)];

        const series = uniqueSensors.map((sensor) => {
            const data = items.filter((item) => item.sensor === sensor).map((item) => item.value);
            return {
                name: sensor,
                data: data,
            };
        });
        setGraphData(series);
        setRefreshing({
            value: false,
            message: "",
        });
    };
    const putAndRefresh = async () => {
        setRefreshing({
            value: true,
            message: "Populating db...",
        });
        const res = await apiReq("data", {
            type: "POPULATE_DB",
            sensors: ["temp", "humidity", "pressure"],
            itemsPerSensor: 10,
        });
        console.log(res.message);
        setRefreshing({
            value: false,
            message: "",
        });
        refreshGraph();
    };

    const nuke = async () => {
        setRefreshing({
            value: true,
            message: "Truncating db...",
        });
        const res = await apiReq("data", {
            type: "NUKE_DB",
        });
        console.log(res.message);
        setRefreshing({
            value: false,
            message: "",
        });
        refreshGraph();
    };

    const options = {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'My chart'
        },
        series: graphData
    };

    return (
        <div className="h-full w-full m-10 space-y-10">
            <div className='w-2/5 m-auto justify-center'>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
            </div>
            <div className="flex space-x-10 items-center justify-center">
                <button className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20" onClick={refreshGraph}>Refresh</button>
                
                <button onClick={putAndRefresh} 
                            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                            >
                            Put Random Stuff in DB
                </button>
                <button onClick={nuke} 
                            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                            >
                            Nuke the DB
                </button>
            </div>
            {refreshing.value && <p className="text-white m-auto text-center">{refreshing.message}</p>}
        </div>
    );

}

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <Graph />
            </main>
        </>
    );
};

export default Home;
import React from 'react';
import {Box, Button, Stack, Textarea} from "@mantine/core";
import { Line } from 'react-chartjs-2';
import {SimlulationResults} from "../math";
import _ from "lodash";
import {useClipboard} from "@mantine/hooks";

interface ResultsProps {
    results: SimlulationResults
}

const options = {
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    stacked: false,
    plugins: {
        title: {
            display: true,
            text: 'Trajektoria uśrednionych miar zaufania',
        },
    },
    scales: {
        y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
        },
        y1: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            grid: {
                drawOnChartArea: false,
            },
        },
    },
};

export const Results = ({results}: ResultsProps) => {
    const csv = "t,V_avg_h,V_avg_s\n"+results.results.trust_avg_h.map((h,t) => t+","+h+","+results.results.trust_avg_s[t]).join("\n");
    const clipboard = useClipboard({timeout: 2000});

    return <Stack>
        <Line options={options} data={{
            labels: _.range(0, results.input.cycles, 1),
            datasets: [
                {
                    label: 'S agenci',
                    data: results.results.trust_avg_s,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y',
                },
                {
                    label: 'H agenci',
                    data: results.results.trust_avg_h,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y1',
                },
            ],
        }} />
        <Textarea label={"CSV z wynikami"} value={csv} rows={20}/>
        <Button onClick={() => clipboard.copy(csv)}>{clipboard.copied ? "Skopiowano" : "Skopiuj CSV do schowka"}</Button>
        <Box style={{height: "300px"}}/>
    </Stack>;
};
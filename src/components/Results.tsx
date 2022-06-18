import React from 'react';
import {Stack} from "@mantine/core";
import { Line } from 'react-chartjs-2';
import {SimlulationResults} from "../math";
import _ from "lodash";

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
    </Stack>;
};
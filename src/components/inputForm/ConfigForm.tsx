import React from 'react';
import {
    Stack,
    TextInput,
    Checkbox,
    Button,
    Group,
    Box,
    NumberInput,
    NativeSelect,
    RadioGroup,
    Radio, LoadingOverlay
} from "@mantine/core";
import {useForm} from "@mantine/form";

export interface ConfigFormValues {
    cycles: number
    n_agentow: number
    s_agentow: number
    k_min: number
    k_max: number
    expoA: number
    expoG: number
    s_type: string
    wola_x: number,
    wola_y: number,
    wola_z: number,
    delta: number, //1, 0,8, 0.6
    scenario: string, //1 zmowa, 0 brak zmowy
    v_0: number
}

interface ConfigFormProps {
    onStart: (values: ConfigFormValues) => void;
    inProgress: boolean
}

export const ConfigForm = ({onStart, inProgress}: ConfigFormProps) => {
    const form = useForm<ConfigFormValues>({
        initialValues: {
            cycles: 5,//100,
            n_agentow: 20,//1000,
            s_agentow: 4,//250,
            k_min: 4,//5,
            k_max: 7,//15,
            expoA: 1,
            expoG: 10,
            s_type: 'M',
            wola_x: 0.5,
            wola_y: 0.5,
            wola_z: 0.5,
            delta: 1,
            scenario: '0',
            v_0: 1
        },
        validate: {
            s_agentow: (value, values) => value > values.n_agentow ? 'musi być mniejsze od N agentów' : null,
            k_max: (value, values) => value >= values.n_agentow ? 'musi być mniejsze od N agentów-1' : null,
            k_min: (value, values) => value > values.k_max ? "musi być mniejsze od k_max" : null,
        }
    })

    return <Stack>
        <form onSubmit={form.onSubmit(onStart)}>
            <LoadingOverlay visible={inProgress} />
            <NumberInput
                {...form.getInputProps('cycles')}
                min={1}
                label={"Liczba cykli"}
            />
            <NumberInput
                {...form.getInputProps('n_agentow')}
                label={"N agentów"}
            />
            <NumberInput
                {...form.getInputProps('s_agentow')}
                label={"S agentów"}
            />
            <Group>
                <NumberInput
                    {...form.getInputProps('k_min')}
                    label={"K min"}
                />
                <NumberInput
                    {...form.getInputProps('k_max')}
                    label={"K max"}
                />
            </Group>
            <Group>
                <NumberInput
                    {...form.getInputProps('expoA')}
                    label={"expo A"}
                />
                <NumberInput
                    {...form.getInputProps('expoG')}
                    label={"expo G"}
                />
            </Group>
            <RadioGroup
                {...form.getInputProps('s_type')}
                label={"S polityka"}
            >
                <Radio value={'M'} label={"M"}/>
                <Radio value={'D'} label={"D"}/>
            </RadioGroup>
            <Group>
                <NumberInput
                    {...form.getInputProps('wola_x')}
                    step={0.01}
                    label={"dobra wola x"}
                />
                <NumberInput
                    {...form.getInputProps('wola_y')}
                    step={0.01}
                    label={"dobra wola y"}
                />
                <NumberInput
                    {...form.getInputProps('wola_z')}
                    step={0.01}
                    label={"dobra wola z"}
                />
            </Group>
            <Group>
                <NumberInput
                    {...form.getInputProps('delta')}
                    step={0.1}
                    label={"δ − współczynnik dyskontowy 1, 0.8, 0.6"}
                />
                <NumberInput
                    {...form.getInputProps('v_0')}
                    step={0.01}
                    max={1}
                    min={0}
                    label={"V_0 - początkowy poziom zaufania"}
                />
            </Group>
            <RadioGroup
                {...form.getInputProps('scenario')}
                label={"Scenariusz"}
            >
                <Radio value={'0'} label={"Brak zmowy"}/>
                <Radio value={'1'} label={"zmowa s-agentów"}/>
            </RadioGroup>

            <Button type="submit">Rozpocznij symulację</Button>
        </form>
    </Stack>;
};
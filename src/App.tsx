import {useEffect, useState} from 'react'
import logo from './logo.svg'
import './App.css'
import {ConfigForm, ConfigFormValues} from "./components/inputForm/ConfigForm";
import {Container, List, Title} from "@mantine/core";
import {runCycles} from "./math";
import {Results} from "./components/Results";

function App() {
    const [loading, setLoading] = useState(false)
    const [start, setStart] = useState<ConfigFormValues|false>(false);
    const [results, setResults] = useState<object|undefined>(undefined);

    useEffect(() => {
        if(start == false) {
            return;
        }
        async function runSimulation(start: any) {
            runCycles(
                start
            )
                .then(results => {setResults(results); return results})
                .finally(() => {
                    setLoading(false)
                    setStart(false);
                })
        }

        runSimulation(start);

    }, [start]);

    return (
        <div className="App">
            <Container>
                <Title order={1}>MPE cz. 2, projekt: Świadczenie usług w systemie wieloagentowym</Title>
                <Title order={2}>Autorzy</Title>
                <List>
                    <List.Item>Marta Krzewińska (<a href={"mailto:s143267@student.pg.edu.pl"}>s143267@student.pg.edu.pl</a>)</List.Item>
                    <List.Item>Damian Grudzień (<a href={"mailto:s143229@student.pg.edu.pl"}>s143229@student.pg.edu.pl</a>)</List.Item>
                </List>
                <Title order={2}>Parametry wejściowe</Title>
                <ConfigForm
                    onStart={v => {
                        setLoading(true);
                        setStart(v);
                    }}
                    inProgress={loading}
                />
                <Title order={2}>Wyniki symulacji</Title>
                {results && <Results results={results}/>}
            </Container>
        </div>
    )
}

export default App

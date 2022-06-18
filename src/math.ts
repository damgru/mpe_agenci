import {ConfigFormValues} from "./components/inputForm/ConfigForm";

interface RAEReport {
    t: number,
    i: number,
    j: number,
    R: number
}

interface RAE {
    [key: number]: RAEReport[][];
}

declare global {
    var trust: any[];
    var rae: RAE;
    var r_avg: number[][]
}

globalThis.trust = [];
globalThis.r_avg = [];
globalThis.rae = {};

export interface SimlulationResults {
    input: any,
    results: any
}

export async function runCycles (
    props: ConfigFormValues,
    beforeEveryCycle: (i: number) => void
): Promise<SimlulationResults> {
    return new Promise(resolve => {
        fillTrust(props.n_agentow, props.v_0);
        fillRae(props.n_agentow);
        for (let cycle = 0; cycle < props.cycles; cycle++) {
            beforeEveryCycle(cycle);
            runCycle(cycle, props);
        }
        resolve({input: props, results: {rae: rae, v: trust}})
    })
}

function runCycle(t: number, props: ConfigFormValues) {
    for (let j = 0; j < props.n_agentow; j++) {
        const providers = selectProviders(j, props);
        providers.map(i => interaction(t,i,j, props))
        console.log(j, providers);
    }

    evaluateCycle(t, props);
}

function selectProviders(forAgent: number, props: ConfigFormValues) {
    const k = randomNumberBetween(props.k_min, props.k_max);
    const providers = [forAgent];
    for (let i = 0; i < k; i++) {
        providers.push(randomNumberFromZeroExcept(props.n_agentow, providers))
    }
    providers.shift(); // remove first element
    return providers;
}

function isSAgent(agentIndex: number, props: ConfigFormValues)
{
    return agentIndex < props.s_agentow;
}

function agentPolicy(agent: number, a: number, b: number, props: ConfigFormValues)
{
    if (props.s_type == 'M') {
        return a*b;
    }
    //s_type == 'D'
    else {
        return Math.min(a,b);
    }
}

function interaction(t: number, i_provider: number, j_receiver: number, props: ConfigFormValues) {
    const available = random(); // todo: dystrybuanta
    const efficiency = random(); // todo: dystrybuanta

    const i_is_s_agent = isSAgent(i_provider, props);
    const j_is_s_agent = isSAgent(j_receiver, props);
    const zmowa = props.scenario == '1' && i_is_s_agent && j_is_s_agent;

    const p_ij : number = i_is_s_agent
        ? (zmowa ? 1 : props.wola_y)
        : goodWill_L(
            available,
            getTrust(t, j_receiver),
            props.wola_x
        )

    const r_ij = j_is_s_agent
        ? (zmowa ? 1 : props.wola_z)
        : goodWill_L(
            efficiency,
            getTrust(t, i_provider),
            props.wola_x
        )

    const big_P_ij = agentPolicy(i_provider, available, p_ij, props);
    const big_R_ij = agentPolicy(j_receiver, efficiency*big_P_ij, r_ij, props);

    saveReport(t, i_provider, j_receiver, big_R_ij );
}

function calculate_avg_report(t: number, i: number, props: ConfigFormValues) {
    let sum = 0;
    for (let j = 0; j < props.n_agentow; j++) {
        const r = findNewestReport(i,j);
        if (r == undefined) {
            continue;
        }
        const t_diff = t - r.t;
        const v_j = trust[j][t];

        sum += v_j * Math.pow(props.delta, t_diff) * r.R;
    }

    return sum;
}

function evaluateCycle(t: number, props: ConfigFormValues) {
    r_avg[t] = [];
    for (let i = 0; i < props.n_agentow; i++) {
        r_avg[t][i] = calculate_avg_report(t, i, props);
    }
    const avg = r_avg[t].reduce((sum, r) => sum + r, 0) / props.n_agentow;
    let N_high = [];
    let N_low = [];
    r_avg[t].map((r, i) => {
        if (r >= avg) {
            N_high.push({i: i, r: r});
        } else {
            N_low.push({i: i, r: r});
        }
    });
}


function fillTrust(n: number, value: number) {
    trust = [];
    for (let i = 0; i < n; i++) {
        trust[i] = [value];
    }
}
function fillRae(n: number) {
    rae = [];
    for (let i = 0; i < n; i++) {
        rae[i] = [];
    }
}

function saveTrust(t: number, agent: number, value: number)
{
    trust[agent][t] = value;
}

function getTrust(t: number, agent: number) {
    return trust[agent][t];
}

function saveReport(t: number, i: number, j: number, Rij: number)
{
    if (!rae[i].hasOwnProperty(j)) {
        rae[i][j] = [];
    }
    rae[i][j][t] = {t: t, i: i, j:j, R: Rij};
}

function findNewestReport(i:number, j:number) {
    return rae[i]?.[j]?.at(-1) ?? undefined;
}

function goodWill_L(a : number, v : number, x : number) {
    if (v >= (1-x)) {
        return a;
    }
    else {
        return 0;
    }
}

const random = Math.random;

function randomNumberFromZero(max: number) {
    return Math.floor(random() * (max));
}

function randomNumberBetween(min: number, max : number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(random() * (max - min + 1)) + min;
}

function randomNumberFromZeroExcept(max: number, except: number[]) {
    let random = 0;
    do {
        random = randomNumberFromZero(max);
    } while (except.includes(random));
    return random;
}
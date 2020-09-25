export type IMetric = {
    metric: string;
    at: string;
    value: number;
    unit: string;
}

export type MetricsReducerState = {
    metrics: {
        [at: string]: IMetric;
    };
    latestValue: {
        [metric: string]: number
    },
    selected: string[];
}

export type SelectPayload = {
    selected: string[];
    metricName: string;
}

export type MetricsWithLatest = {
    metrics: {
        [at: string]: IMetric;
    };
    latestValue: {
        [metric: string]: number
    }
}

export type MetricsPayload = {
    metrics: {
        [at: string]: IMetric;
    };
}
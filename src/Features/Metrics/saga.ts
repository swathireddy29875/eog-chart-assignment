import { takeEvery, put, fork, select } from 'redux-saga/effects'
import { actions } from './reducer';
import { SelectPayload, IMetric } from './types'
import { PayloadAction } from 'redux-starter-kit';
import client from './client';
import { OperationResult } from 'urql';
import { getMetrics, getLatestValue } from './selectors';
import { getTimeAt } from '../../utils';

const MINUTES_BEFORE = 30;

interface QueryResult {
    getMeasurements: IMetric[]
}

interface QueryArgs {
    metricName: string;
    after: number
}

function* merge(list?: IMetric[]) {
    let metrics: { [at: string]: IMetric } = yield select(getMetrics);
    list && list.map(item => {
        const { metric, at, value } = item;
        const hrs = new Date(at).getHours() % 12 || 12;
        const mins = new Date(at).getMinutes()
        const timeAt = `${("0" + hrs).slice(-2)}:${("0" + mins).slice(-2)}`
        metrics = {
            ...metrics,
            [at]: {
                ...metrics[at],
                [metric]: value,
                at: timeAt,
            },
        }
        return null;
    })
    yield put(actions.metricsDataReceived({ metrics }))
}

function* fetchOldData({ payload }: PayloadAction<SelectPayload>) {
    const { metricName } = payload;
    console.log('metricName', metricName)
    const { data }: OperationResult<QueryResult> = yield client.query<QueryResult, QueryArgs>(`
    query($metricName: String!, $after: Timestamp) {
        getMeasurements(input: { metricName: $metricName, after: $after }) {
            at
            metric
            value
            unit
        }
    }`, {
        metricName,
        after: getTimeAt(MINUTES_BEFORE)
    }).toPromise();
    yield fork(merge, data && data.getMeasurements)
}

function* convert({ payload: { metric, at, value } }: PayloadAction<IMetric>) {
    const data: { [at: string]: IMetric } = yield select(getMetrics);
    const lastVal: { [metric: string]: number } = yield select(getLatestValue)
    const h = new Date(at).getHours() % 12 || 12;
    const m = new Date(at).getMinutes()
    const timeAt = `${("0" + h).slice(-2)}:${("0" + m).slice(-2)}`
    const metrics = {
        ...data,
        [at]: {
            ...data[at],
            [metric]: value,
            at: timeAt,
        },
    };
    const latestValue = {
        ...lastVal,
        [metric]: value
    }
    yield put(actions.metricDataUpdated({ metrics, latestValue }))
}

export default function* watcher() {
    yield takeEvery(actions.newMetricValueFetched.type, convert);
    yield takeEvery(actions.metricsSelected.type, fetchOldData);
}
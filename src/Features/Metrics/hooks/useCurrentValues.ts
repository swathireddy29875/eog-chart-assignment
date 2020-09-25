import { useDispatch, useSelector } from 'react-redux';
import { useSubscription } from 'urql';
import { getLatestValue, getSelectedItems } from '../selectors';
import { IMetric } from '../types';
import { actions } from '../reducer';
import { useEffect } from 'react';


interface SubscriptionData {
    newMeasurement: IMetric
}

export default (): [string[], { [metric: string]: number }] => {
    const selectedItems = useSelector(getSelectedItems);
    const latestValue = useSelector(getLatestValue);
    const dispatch = useDispatch();
    const [result] = useSubscription<SubscriptionData>({
        query: `
        subscription {
            newMeasurement {
                at
                metric
                value
                unit
            }
        }`,
        pause: !selectedItems.length
    })
    const { data } = result;

    useEffect(() => {
        data && dispatch(actions.newMetricValueFetched(data.newMeasurement))
    }, [data, dispatch])

    return [selectedItems, latestValue]
}
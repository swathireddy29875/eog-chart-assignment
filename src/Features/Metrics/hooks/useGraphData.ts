import { useSelector } from 'react-redux'
import { getMetrics, getSelectedItems } from '../selectors';
import { IMetric } from '../types';

export default (): [IMetric[], string[]] => {
    const selectedMetrics = useSelector(getSelectedItems);
    const metrics = useSelector(getMetrics);
    console.log('metrics', metrics)
    const data = Object.keys(metrics).map(metricName => metrics[metricName])
    return [data, selectedMetrics]
}
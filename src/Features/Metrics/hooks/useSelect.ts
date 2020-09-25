import { useState, useEffect } from 'react';
import { OptionsType, ValueType, ActionMeta, OptionTypeBase } from 'react-select';
import { useQuery } from 'urql';
import { useDispatch } from 'react-redux';
import { actions } from '../reducer';

const query =`
    query {
        getMetrics
    }
`;

interface Option extends OptionTypeBase {
    label: string;
    value: string;
}

export default (): [OptionsType<Option>, (selected: ValueType<Option>, action: ActionMeta<Option>) => void] => {
    const [result] = useQuery({
        query
    })
    const dispatch = useDispatch();
    const { data, error } = result;

    const onChange = (selected: ValueType<Option>, action: ActionMeta<Option>) => {
        const metricName = action.option && action.option.value;
        console.log('metricName', metricName)
        const selectedItems = selected ? selected.map((item: Option) => item.value): [];
        dispatch(actions.metricsSelected({ selected: selectedItems, metricName: metricName || '' }));
    };

    const [allMetrics, setAllMetrics] = useState<OptionsType<Option>>([]);

    useEffect(() => {
        if (error) {
          return;
        }
        if (!data) return;
        const { getMetrics } = data;
        setAllMetrics(getMetrics.map((option: string) => ({ label: option, value: option })))
    }, [dispatch, data, error]);
    return [allMetrics, onChange]
}
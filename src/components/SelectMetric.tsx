import React from 'react';
import Select from 'react-select';
import useSelect from '../Features/Metrics/hooks/useSelect';

const SelectMetric: React.FC = () => {
    const [allMetrics, onChange] = useSelect();

    return <Select
        name='metricSelect'
        options={allMetrics}
        isMulti
        closeMenuOnSelect={false}
        onChange={onChange}
    />
}

export default SelectMetric;
import { useEffect, useState } from 'react';
import { useQuery } from 'urql';

interface QueryResult {
    getLastKnownMeasurement: {
        value: number;
    }
}

interface QueryArgs {
    metricName: string
}

export default (metricName: string, currentValue: number) => {
    const [value, setValue] = useState(currentValue);
    const [result] = useQuery<QueryResult, QueryArgs>({
        query: `query ($metricName: String!) {
            getLastKnownMeasurement(metricName:$metricName){
              metric
              value
              at
              unit
            }
          }`,
        variables: {
            metricName
        }
    });
    const { data } = result;
    useEffect(() => {
        setValue(data ? data.getLastKnownMeasurement.value : 0)
    }, [data])
    return value
}
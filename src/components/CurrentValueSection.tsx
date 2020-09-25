import React from 'react';
import { Grid, CardContent, Typography, Card } from '@material-ui/core';
import useCurrentValues from '../Features/Metrics/hooks/useCurrentValues';
import useCurrentValue from '../Features/Metrics/hooks/useCurrentValue';

interface CurrentValueCardProps {
    metricName: string;
    currentValue: number;
}

const CurrentValueCard: React.FC<CurrentValueCardProps> = ({ metricName, currentValue }) => {
    const value = useCurrentValue(metricName, currentValue);
    return <Grid item md={5} xs={6}>
        <Card>
            <CardContent>
                <Typography variant="h6">
                    {metricName}
                </Typography>
                <Typography variant="h3">
                    {currentValue ? currentValue : value}
                </Typography>
            </CardContent>
        </Card>
    </Grid>
}

const MetricCardsSection: React.FC = () => {
    const [selectedMetrics, latestValue] = useCurrentValues();
    return <>
        {
            selectedMetrics.map((metric) => (
                <CurrentValueCard key={metric}
                    metricName={metric}
                    currentValue={latestValue[metric]}
                />
            ))
        }
    </>
}

export default MetricCardsSection;
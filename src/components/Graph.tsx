import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { green, pink, blue, grey, red, deepOrange } from '@material-ui/core/colors';
import { Card, CardContent, Grid, makeStyles } from '@material-ui/core';

import { getAxisID, unitAdder } from '../utils';
import useGraphData from '../Features/Metrics/hooks/useGraphData';

const isEnabled = (selectedItems: string[], axisID: number) => selectedItems.some((m) => getAxisID(m) === axisID);

const COLORS = [blue[500], grey[600], red[500], green[500], pink[400], deepOrange[500]];
const getUnits = (selectedMetrics: string[]): Units => ({
    percentage: {
        enabled: isEnabled(selectedMetrics, 0),
        value: '%',
        dx: 10,
        dy: 10,
        angle: -90,
        yAxisId: 0
    },
    pascal: {
        enabled: isEnabled(selectedMetrics, 1),
        value: 'PSI',
        dx: 10,
        dy: 10,
        angle: -90,
        fontSize: 12,
        yAxisId: 1,
        tickFormatter: unitAdder
    },
    fahrenheit: {
        enabled: isEnabled(selectedMetrics, 2),
        value: 'F',
        dx: 10,
        dy: 15,
        angle: -90,
        fontSize: 12,
        yAxisId: 2
    }
})

type Units = {
    [key: string]: {
        enabled: boolean;
        value: string;
        dx: number;
        dy: number;
        angle: number;
        yAxisId: number;
        fontSize?: number;
        tickFormatter?: (value: number) => string;
    }
}

const useStyles = makeStyles(theme => ({
    graphContainer: {
        width: '85vw',
        height: '90vh',
        padding: theme.spacing(2)
    },
}));

const Graph: React.FC = () => {
    const [data, selectedMetrics] = useGraphData();
    const classes = useStyles();
    const units = getUnits(selectedMetrics);
    return <Card>
            <CardContent>
            <Grid container className={classes.graphContainer}>
                <ResponsiveContainer>
                    <LineChart
                        width={600}
                        height={600}
                        data={data}
                    >
                        {
                            Object.keys(units).map(key => {
                                const {
                                    enabled,
                                    yAxisId,
                                    tickFormatter,
                                    ...rest
                                } = units[key];
                                return enabled && <YAxis
                                    key={key}
                                    label={{ position: 'insideTopLeft', fill: '#908e8e', ...rest }}
                                    yAxisId={yAxisId}
                                    tickFormatter={tickFormatter}
                                />
                            })
                        }
                        {
                            selectedMetrics.length > 0 &&
                            <XAxis dataKey="at" interval={150} />
                        }
                        {
                            selectedMetrics.map((metricName, index) => {
                                return <Line
                                    key={metricName}
                                    yAxisId={getAxisID(metricName)}
                                    dataKey={metricName}
                                    stroke={COLORS[index]}
                                />
                            })
                        }
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>
                </Grid>
            </CardContent>
        </Card>
}

export default Graph
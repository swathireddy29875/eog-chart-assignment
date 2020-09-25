import React from 'react';
import { Provider } from 'urql';
import { Grid, makeStyles } from '@material-ui/core';
import Select from '../../components/SelectMetric';
import Graphs from '../../components/Graph';
import CurrentValueSection from '../../components/CurrentValueSection';
import client from './client';


export default () => {
    return <Provider value={client}>
        <Metrics />
    </Provider>
}

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(4)
    },
    graphSection: {
        padding: theme.spacing(4)
    }
}))

const Metrics = () => {
    const classes = useStyles();
    return <div className={classes.container}>
        <Grid container spacing={2} direction='row-reverse'>
            <Grid item xs={12} md={6} lg={5}>
                <Select />
            </Grid>
            <Grid item lg={7} md={6} xs={12}>
                <Grid container spacing={2}>
                    <CurrentValueSection />
                </Grid>
            </Grid>
        </Grid>
        <Grid container justify='center' alignItems='center' className={classes.graphSection}>
            <Graphs />
        </Grid>
    </div>
}
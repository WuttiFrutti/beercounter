import { FlexibleWidthXYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis';
import { Box } from '@mui/system';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from "react";
import { mapDrinksToGraph } from '../../Config/Helpers';
import moment from "moment"

const graphStyle = {
    line: { stroke: '#ADDDE1' },
    ticks: { stroke: '#ADDDE1' },
    text: { stroke: 'none', fill: '#285a84', fontWeight: 600 },
    title: { stroke: 'none', fill: '#285a84', fontWeight: 600, fontSize: "1.2em" }
}

const week = 1000 * 60 * 60 * 24 * 7


const Graph = ({ data, height = 200 }) => {
    const [cumulative, setCumulative] = useState(false);
    const [total, setTotal] = useState(false)

    if (data === undefined || data.length === 0) {
        return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50px" }}>
            <Typography variant="h6" color="primary">
                Er is geen data om weer te geven.
            </Typography>
        </Box>
    }
    const datapoints = 10;
    const mappedData = mapDrinksToGraph(data, { cumulate: cumulative, datapoints: datapoints, absoluteStart: moment().endOf("week").valueOf() - moment().valueOf() + (1000 * 60 * 60 * 24), forceDif: total ? undefined : week })

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <FlexibleWidthXYPlot height={height}>
                <VerticalBarSeries color="#ef6f53" animation data={mappedData} />
                <XAxis title="Tijd" style={{ ...graphStyle }} tickFormat={(d, index, f, total, ...s) => {
                    const date = new Date(mappedData[index].time);
                    return `${date.getDate()}/${date.getMonth() + 1}`
                }} />
                <YAxis title="Bier" style={graphStyle} />
            </FlexibleWidthXYPlot >
            <Stack direction="row" spacing={1} sx={{ alignSelf: "end" }} alignItems="center">
                {
                    data.length > 1 ? <>
                        <Switch value={total} onChange={(e) => setTotal(e.target.checked)} />
                        <Typography color="primary" sx={{ fontWeight: "600" }}>Totaal</Typography>
                    </> : null
                }
                <Switch value={cumulative} onChange={(e) => setCumulative(e.target.checked)} />
                <Typography color="primary" sx={{ fontWeight: "600" }}>Cumulatief</Typography>
            </Stack>
        </Box>
    );

}



export default Graph;
import React, { Suspense } from 'react';
import { CircularProgress, Box } from "@mui/material";



const Wait = ({ children }) => {
    return <Suspense fallback={<Box sx={{ display: "flex", margin:"5em", justifyContent: "center", alignItems: "center" }}>
        <Box><CircularProgress /></Box>
    </Box>}>
        {children}
    </Suspense>
}

export default Wait;
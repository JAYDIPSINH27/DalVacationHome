import react from 'react'
import Navbar from './Navbar'
import {Box} from '@mui/material'
const AgentStatistics = ()=>{


    return(
        <>
        <Navbar/>
        <Box
        sx={{
            position: "absolute",
            // top: 0,
            // left: 0,
            width: "100%",
            height: "100%",
            // transform: `scale(${zoomLevel})`,
            // transformOrigin: "0 0",
        }}
    >
        <iframe
            title="Room Statistics"
            width="100%"
            height="100%"
            src="https://lookerstudio.google.com/embed/reporting/d552662e-fe00-4355-ae1b-34ba3cae61d1/page/hsl6D"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
        ></iframe>
    </Box>
    </>
    )

}

export default AgentStatistics
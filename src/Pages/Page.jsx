
import { Box } from '@mui/system';





const Page = (args) => {

    return <Box {...args} sx={{minWidth:"100vw", overflowX:"hidden",...args.sx}}>
        {args.children}
    </Box>
}





export default Page;
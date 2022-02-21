
import { Box } from '@mui/system';





const Page = (args) => {

    return <Box {...args} sx={{minWidth:"100vw",...args.sx}}>
        {args.children}
    </Box>
}





export default Page;

import { Box } from '@mui/system';


const Page = (args) => {
    return <Box {...args} id="main-page" sx={{bgcolor: 'background.default', minWidth:"100vw",...args.sx}}>{args.children}</Box>
}





export default Page;
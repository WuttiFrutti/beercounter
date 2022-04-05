import { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";

const AnimatedLink = forwardRef((args, ref) => {
    return <RouterLink {...args} to={
        {
            pathname: args.to,
            search: args.search,
            hash: args.hash,
            state: { ...args.state, animation: args.animation }

        }} />

});

export default AnimatedLink;
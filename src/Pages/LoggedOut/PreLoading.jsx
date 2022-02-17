import { CircularProgress, Box } from "@mui/material";
import styled from 'styled-components';
import { useEffect } from 'react';
import { checkLogin } from './../../Config/Axios';


const Loading = styled(Box)({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%,-50%)"
})

const PreLoading = ({ swap, setLoaded, promise }) => {


  useEffect(() => {
    if (swap) {
      checkLogin().then((res) => {
          Promise.resolve(promise).then(() => {
            setLoaded(true)
            if (!res) swap("login", "swap-right");
          })
      });
    }
  }, [swap])


  return <div><Loading><CircularProgress /></Loading></div>
}


export default PreLoading;
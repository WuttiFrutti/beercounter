import PreLoading from "./LoggedOut/PreLoading";
import IconPage from './IconPage';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect } from "react";
import { MainStore } from './../Config/MainStore';
import { joinList } from "../Config/Axios";
import { openSnack } from "../Config/UIStore";


const Join = () => {
    const history = useHistory();
    const params = useParams();

    useEffect(() => {
        joinList(params.shareId).then(() => {
            history.push("/");
            openSnack(<>Je doet nu mee aan de lijst!</>,"info")
        }).catch(() => {
            history.push("/")
        });
    }, [])

    return <>
        <IconPage><PreLoading></PreLoading></IconPage>
    </>
}



export default Join;
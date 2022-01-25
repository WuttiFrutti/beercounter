import PreLoading from "./LoggedOut/PreLoading";
import IconPage from './IconPage';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect } from "react";
import { MainStore } from './../Config/MainStore';
import { joinList } from "../Config/Axios";


const Join = () => {
    const history = useHistory();
    const params = useParams();

    useEffect(() => {
        joinList(params.shareId).then(() => {
            history.push("/")
            MainStore.update(s => ({ ...s ,snack:{ open:true, severity:"info", children:<>Je doet nu mee aan de lijst!</> }  }));
        }).catch(() => {
            history.push("/")
        });
    }, [])

    return <>
        <IconPage><PreLoading></PreLoading></IconPage>
    </>
}



export default Join;
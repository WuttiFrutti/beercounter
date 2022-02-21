
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import UserList from './../Components/UserList';
import { MainStore } from '../Config/MainStore';
import NotFound from './404';
import Wait from './Wait';



const SingleList = () => {
    const { list: listId } = useParams();
    const lists = MainStore.useState(s => s.lists, []);

    const list = lists.find(l => l._id === listId);

    return lists.length !== 0 && !list ? <NotFound /> : <Container sx={{ marginTop: "2em" }} maxWidth="sm">
        {list ? <UserList list={list} /> : <Wait/> }
    </Container>
}


export default SingleList;
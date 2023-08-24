import React , {useEffect}  from 'react';
import Layout from './Layout';
import UserList from '../components/UserList';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

const Users = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isError, user} = useSelector((state => state.auth));

    useEffect(()=>{
        dispatch(getMe());
    }, [dispatch]);

    useEffect(()=>{
        if(isError){
            navigate("/");
        }
        // if((user && (user.role === "non-pustakawan" || user.role === "guest"))){
        if(user && user.role !== "super-admin"){
            navigate("/403");
        }
    }, [isError, user, navigate]);
  return (
    <Layout>
        <UserList/>
    </Layout>
  )
}

export default Users
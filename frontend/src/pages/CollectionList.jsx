import React , {useEffect}  from 'react';
import Layout from './Layout';
import CollectionsList from '../components/CollectionsList';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

const CollectionList = () => {
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
        
    }, [isError, user, navigate]);
  return (
    <Layout>
        <CollectionsList/>
    </Layout>
  )
}

export default CollectionList
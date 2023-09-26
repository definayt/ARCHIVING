import React , {useEffect}  from 'react';
import Layout from './Layout';
import CollectionsPublish1stYearList from '../components/CollectionsPublish1stYearList';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

const CollectionsPublish1stYear = () => {
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
        <CollectionsPublish1stYearList/>
    </Layout>
  )
}

export default CollectionsPublish1stYear
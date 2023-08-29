import React , {useEffect}  from 'react';
import Layout from './Layout';
import FormEditLanguage from '../components/FormEditLanguage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

const EditLanguage = () => {
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
        if((user && (user.role === "non-pustakawan" || user.role === "guest"))){
            navigate("/403");
        }
    }, [isError, user, navigate]);
  return (
    <Layout>
        <FormEditLanguage />
    </Layout>
  )
}

export default EditLanguage
import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { reset, getMe } from "../features/authSlice";
import axios from 'axios';
import SuccessModal from './SuccessModal';

const Registration = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user, isError, isSuccess, isLoading, message} = useSelector((state) => state.auth);
    const [showMessageError, setShowMessageError] = useState(false);
    const [msg, setMsg] = useState("");

    useEffect(()=>{
        dispatch(getMe());
    }, [dispatch]);

    useEffect(()=>{
        if(user || isSuccess){
            navigate("/dashboard");
        }
        dispatch(reset());
    }, [user, isSuccess, dispatch, navigate])
    const [modalState, setModalState] = useState(false);

    const navigation = () => {
        navigate("/login");
    };

    const toggleModal = () => {
        setModalState(!modalState);
    };
    const registration = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/users", {
                name:name,
                email: email,
                password: password,
                confPassword: confPassword,
                role: "guest",
            });
            toggleModal();
        } catch (error) {
            if(error.response){
                setShowMessageError(true);
                setMsg(error.response.data.msg);
            }
        }
    };
    
  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <SuccessModal confirmModal={navigation} modalState={modalState} msg={"Registrasi berhasil."}  />
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4">
                <form onSubmit={registration} className='box'>
                    {isError && message !== "Mohon Login Terlebih Dahulu" &&
                    <article className="message is-danger">
                        <div className="message-body">
                        {message}
                        </div>
                    </article> }
                     {showMessageError &&
                     <article className="message is-danger">
                        <div className="message-body">
                            {msg}
                        </div>
                     </article>
                     }
                    <h1 className='title is-2'>Daftar</h1>
                    <div className="field">
                        <label className="label">Nama</label>
                        <div className="control">
                            <input 
                                type="text" 
                                className="input" 
                                value={name} 
                                onChange={(e)=>setName(e.target.value)} 
                                placeholder='Nama' 
                                name='name'
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Email</label>
                        <div className="control">
                            <input 
                                type="email" 
                                className="input" 
                                value={email} 
                                onChange={(e)=>setEmail(e.target.value)} 
                                placeholder='Email' 
                                name='email'
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Password</label>
                        <div className="control">
                            <input 
                                type="password" 
                                className="input" 
                                value={password} 
                                onChange={(e)=>setPassword(e.target.value)} 
                                placeholder="Password"
                                name='password'
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Konfirmasi Password</label>
                        <div className="control">
                            <input 
                                type="password" 
                                className="input" 
                                value={confPassword} 
                                onChange={(e)=>setConfPassword(e.target.value)} 
                                placeholder="Konfirmasi Password"
                                name='confirmation-password'
                            />
                        </div>
                    </div>
                    <div className="field mt-5">
                       <button type='submit' className="button is-primary is-fullwidth">
                            {isLoading ? 'Loading...' : 'Daftar'}
                        </button>
                    </div>
                    <p className='has-text-centered'>Sudah memiliki akun?</p>
                    <div className="field mt-3">
                       <Link to={'/login'} className="button is-success is-fullwidth">
                            {'Login'}
                        </Link>
                    </div>
                </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Registration
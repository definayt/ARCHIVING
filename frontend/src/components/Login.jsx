import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LoginUser, reset, getMe } from "../features/authSlice";
import background from "../assets/img/Sign-in.png";
import logo from "../assets/img/logo-BP.png";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user, isError, isSuccess, isLoading, message} = useSelector((state) => state.auth);

    useEffect(()=>{
        dispatch(getMe());
    }, [dispatch]);

    useEffect(()=>{
        if(user || isSuccess){
            navigate("/dashboard");
        }
        dispatch(reset());
    }, [user, isSuccess, dispatch, navigate])

    const Auth = (e) => {
        e.preventDefault();
        dispatch(LoginUser({email, password}));
    }
  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth"style={{ backgroundImage: `url(${background})` }}>
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4">
                <form onSubmit={Auth} className='box' style={{boxShadow: "inset 0 -3em 3em rgba(0, 200, 0, 0.3)"}}>
                    <div className='has-text-centered pb-3'>
                        <img src={logo} style={{maxHeight: "3rem"}} alt='Logo Balai Pustaka' />
                        <h1 className='title is-2'>Login</h1>
                    </div>
                    {isError && <article className="message is-danger">
                        <div className="message-body">
                        {message}
                        </div>
                    </article> }
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
                    <div className="field mt-5">
                       <button type='submit' className="button is-success is-fullwidth">
                            {isLoading ? 'Loading...' : 'Login'}
                        </button>
                    </div>
                    <p className='has-text-centered'>Belum memiliki akun?</p>
                    <div className="field mt-3">
                       <Link to={'/registration'} className="button is-primary is-fullwidth">
                            {'Daftar'}
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

export default Login
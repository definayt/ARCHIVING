import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import InputMask from "react-input-mask";

const ViewCollection= () => {
    const [uuid, setUUID] = useState("");
    const [no_bp, setNoBP] = useState("");
    const [isbn, setISBN] = useState("");
    const [title, setTitle] = useState("");
    const [writer, setWriter] = useState("");
    const [publish_1st_year, setPublish1stYear] = useState("");
    const [publish_last_year, setPublishLastYear] = useState("");
    const [amount_printed, setAmountPrinted] = useState("");
    const [category, setCategory] = useState("");
    const [story_type, setStoryType] = useState("");
    const [language, setLanguage] = useState("");
    const [digital_data, setDigitalData] = useState([]);
    const [synopsis, setSynopsis] = useState("");
    const [user, setUser] = useState([]);
    const [msg, setMsg] = useState("");    
    const {id} = useParams();

    useEffect(() => {
        const getCollectionById = async () => {
            try {
                showSpinner();
                const response = await axios.get(`http://localhost:5000/collections/${id}`);
                if(response.data.uuid){
                    setUUID(response.data.uuid);
                }
                if(response.data.no_bp){
                    setNoBP(response.data.no_bp);
                }
                if(response.data.isbn){
                    setISBN(response.data.isbn);
                }
                if(response.data.title){
                    setTitle(response.data.title);
                }
                if(response.data.writer){
                    setWriter(response.data.writer);
                }
                if(response.data.publish_1st_year){
                    setPublish1stYear(response.data.publish_1st_year);
                }
                if(response.data.publish_last_year){
                    setPublishLastYear(response.data.publish_last_year);
                }
                if(response.data.amount_printed){
                    setAmountPrinted(response.data.amount_printed);
                }
                if(response.data.category.category){
                    setCategory(response.data.category.category);
                }
                if(response.data.story_type.story_type){
                    setStoryType(response.data.story_type.story_type);
                }
                if(response.data.language.language){
                    setLanguage(response.data.language.language);
                }
                if(response.data.digital_collections.length){
                    setDigitalData(response.data.digital_collections);
                }
                if(response.data.synopsis){
                    setSynopsis(response.data.synopsis);
                }
                if(response.data.user){
                    setUser(response.data.user.name);
                }
            } catch (error) {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }finally {
                hideSpinner();
            }
        };
        getCollectionById();
    }, [id]);

    const [display_value, setDisplayValue] = useState("none");
    const [display_form, setDisplayForm] = useState("none");
    function showSpinner() {
        setDisplayValue("block");
        setDisplayForm("none");
    }
      
    function hideSpinner() {
        setDisplayValue("none");
        setDisplayForm("block");
    }


  return (
    <div>
        <div style={{display: display_value}} className='column is-fullWidth'>
        <div className='equal-height'>
            <div className='is-flex is-horizontal-center'>
                <figure className='image is-64x64'>
                <img alt='loading'  src="http://chimplyimage.appspot.com/images/samples/classic-spinner/animatedCircle.gif" />
                    </figure>
            </div>
        </div>
        </div>
        <div style={{display: display_form}}>
        <div></div>
        <h1 className='title has-text-centered mt-3'>Koleksi</h1>
        <h2 className='subtitle has-text-centered'>Detail Koleksi</h2>
        <div className="card">
            <div className="card-content">
                <div className="content">
                    <form>
                        <div className="field">
                            <label className="label">Nomor BP</label>
                            <div className="control">
                                <InputMask 
                                    className="input"
                                    maskplaceholder="xxxxx"
                                    value={no_bp} 
                                    onChange={(e) => setNoBP(e.target.value)} 
                                    placeholder='Nomor BP'
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">ISBN</label>
                            <div className="control">
                                <InputMask 
                                    className="input"
                                    maskplaceholder="xxx-xxx-xxx-xxx-x"
                                    value={isbn} 
                                    onChange={(e) => setISBN(e.target.value)} 
                                    placeholder='ISBN'
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Judul</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    placeholder='Nama'
                                    disabled />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Penulis</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={writer} 
                                    onChange={(e) => setWriter(e.target.value)} 
                                    placeholder='Penulis'
                                    disabled />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Tahun Terbit Cetakan Pertama</label>
                            <div className="control">
                                <InputMask 
                                    className="input"
                                    maskplaceholder="xxxx"
                                    value={publish_1st_year} 
                                    onChange={(e) => setPublish1stYear(e.target.value)} 
                                    placeholder='Tahun Terbit Cetakan Pertama'
                                    minLength={4}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Tahun Cetakan Terakhir</label>
                            <div className="control">
                                <InputMask 
                                    className="input"
                                    maskplaceholder="xxxx"
                                    value={publish_last_year} 
                                    onChange={(e) => setPublishLastYear(e.target.value)} 
                                    placeholder='Tahun Cetakan Terakhir'
                                    minLength={4}
                                    disabled
                                />
                                
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Jumlah Cetakan</label>
                            <div className="control">
                                <input 
                                    type="number" 
                                    min={0}
                                    step={1}
                                    onKeyPress={(event) => {
                                        if (event.charCode < 48) {
                                          event.preventDefault();
                                        }
                                      }}
                                    className="input" 
                                    value={amount_printed} 
                                    onChange={(e) => setAmountPrinted(e.target.value)} 
                                    placeholder='Jumlah Cetakan'
                                    disabled />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Kategori</label>
                            <div className="control">
                                <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)} 
                                    placeholder='Kategori'
                                    disabled />
                            </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Jenis Cerita</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={story_type} 
                                    onChange={(e) => setStoryType(e.target.value)} 
                                    placeholder='Jenis Cerita'
                                    disabled />
                            </div>
                        </div>
                        <div classNa    me="field">
                            <label className="label">Bahasa</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={language} 
                                    onChange={(e) => setLanguage(e.target.value)} 
                                    placeholder='Bahasa'
                                    disabled />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Diinput Oleh</label>
                            <div className="control">
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={user} 
                                    onChange={(e) => setUser(e.target.value)} 
                                    placeholder=''
                                    disabled />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Data Digital</label>
                                <div className="card">
                                    <div className="card-content">
                                        <div className="content">
                                        {digital_data.map((digital_collection, index) => (
                                                <div>
                                                {/* <p>{digital_collection.digital_datum.file_digital}</p> */}
                                                <p>{digital_collection.digital_datum.digital_format.digital_format}</p>
                                                </div>
                                            ))
                                            }
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div className="field">
                            <label className="label">Sinopsis</label>
                                <div className="card">
                                    <div className="card-content">
                                        <div className="content">
                                        <p style={{whiteSpace: "pre-wrap"}}>{synopsis}</p>
                                        </div>
                                    </div>
                                </div>
                        </div>     
                       
                        <div className="field">
                            <div className="control">
                                <div className='buttons is-centered'>
                                <Link to={`/collections/edit/${uuid}`} className='button bulma is-warning mr-2'> Edit</Link>
                                    <Link to={"/collection"} className="button is-danger mr-2">Kembali</Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default ViewCollection
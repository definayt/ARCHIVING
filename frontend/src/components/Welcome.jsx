import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import '../App.css';

const Welcome = () => {
    const {user} = useSelector((state) => state.auth);
    const [collections, setCollections] = useState([]);
    const [digitalCollection, setDigitalCollections] = useState([]);
    const [categoryCollections, setCategoryCollections] = useState([]);
    const [storyTypeCollections, setStoryTypeCollections] = useState([]);
    const [languageCollections, setLanguageCollections] = useState([]);
    const [publish1stCollections, setPublish1stCollections] = useState([]);
    
    useEffect(()=>{
      getCollections();
      getDigitalCollections();
      getCategoryCollections();
      getStoryTypeCollections();
      getLanguageCollections();
      getPublish1stCollections();
    }, []);

    const navigate = useNavigate();
    const dataTotalKoleksi = [
      { 
        "id" : "Belum ada koleksi digital",
        "label" : "Belum ada koleksi digital",
        "value" : collections.countCollection - digitalCollection.length,
       },
      { 
        "id" : "Sudah ada koleksi digital",
        "label" : "Sudah ada koleksi digital",
        "value" : digitalCollection.length,
       },
    ];

    const dataKategori = [];
    categoryCollections.forEach(element => {
      dataKategori.push({
        "id": element.category.category,
        "label" : element.category.category,
        "value" : element.countCategory,
      })
    });    

    const getCollections = async () => {
      await axios.get('http://localhost:5000/collection/count-all')
        .then((response) => {
          setCollections(response.data);
        })
        .catch((error) => {
            // Error
            switch (error.response.status) {
                case 403:
                    navigate("/403");
                    break;
                default:
                    break
            }
        });
    };

    const getDigitalCollections = async () => {
      await axios.get('http://localhost:5000/digital-collections')
        .then((response) => {
          setDigitalCollections(response.data);
        })
        .catch((error) => {
            // Error
            switch (error.response.status) {
                case 403:
                    navigate("/403");
                    break;
                default:
                    break
            }
        });
    };

    const getCategoryCollections = async () => {
      await axios.get('http://localhost:5000/collection/count-category')
        .then((response) => {
          setCategoryCollections(response.data);
        })
        .catch((error) => {
            // Error
            switch (error.response.status) {
                case 403:
                    navigate("/403");
                    break;
                default:
                    break
            }
        });
    };

    const getStoryTypeCollections = async () => {
      await axios.get('http://localhost:5000/collection/count-story-type')
        .then((response) => {
          setStoryTypeCollections(response.data);
        })
        .catch((error) => {
            // Error
            switch (error.response.status) {
                case 403:
                    navigate("/403");
                    break;
                default:
                    break
            }
        });
    };

    const getLanguageCollections = async () => {
      await axios.get('http://localhost:5000/collection/count-language')
        .then((response) => {
          setLanguageCollections(response.data);
        })
        .catch((error) => {
            // Error
            switch (error.response.status) {
                case 403:
                    navigate("/403");
                    break;
                default:
                    break
            }
        });
    };

    const getPublish1stCollections = async () => {
      await axios.get('http://localhost:5000/collection/count-publish-1st-year')
        .then((response) => {
          setPublish1stCollections(response.data);
        })
        .catch((error) => {
            // Error
            switch (error.response.status) {
                case 403:
                    navigate("/403");
                    break;
                default:
                    break
            }
        });
    };

    const dataJenisCerita = [];
    storyTypeCollections.forEach(element => {
      dataJenisCerita.push({
        "story_type": element.story_type.story_type,
        "Total Koleksi" : element.countStoryType
      });
    });

    const dataBahasa = [];
    languageCollections.forEach(element => {
      dataBahasa.push({
        "language": element.language.language,
        "Total Koleksi" : element.countLanguage
      });
    });

    const dataTahunTerbit = [];
    let countYear = 0;
    let countNull = 0;
    
    Object.keys(publish1stCollections[0] || {}).forEach(function(key){
      if(key !== "count"){
        dataTahunTerbit.push({
          "publish_1st_year": key,
          "Total Koleksi" : publish1stCollections[0][key]
        });
        countYear+=publish1stCollections[0][key];
      }else{
        countNull = publish1stCollections[0][key]-countYear;
      }
    });
    dataTahunTerbit.push({
      "publish_1st_year": "Tidak ada",
      "Total Koleksi" : countNull
    });

  return (
    <div>
        <h1 className='title has-text-centered mt-3'>Dashboard</h1>
        <div className='columns' style={{ height: '350px' }}>
          <div className='column is-half' style={{ height: '100%' }}>
            <h3 className='subtitle has-text-centered'>Total Koleksi <strong>{collections.countCollection}</strong> Judul</h3>
            <ResponsivePie
              data={dataTotalKoleksi}
              margin={{ top: 40, right: 80, bottom: 150, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              colors={{ scheme: 'paired' }}
              borderColor={{
                  from: 'color',
                  modifiers: [
                      [
                          'darker',
                          0.2
                      ]
                  ]
              }}
              arcLinkLabel="label"
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsStraightLength = {11}
              arcLinkLabelsThickness={3}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                  from: 'color',
                  modifiers: [
                      [
                          'darker',
                          3
                      ]
                  ]
              }}
              legends={[
                {
                    anchor: 'bottom',
                    direction: 'column',
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 3,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000'
                            }
                        }
                    ]
                }
              ]}
            />
          </div>
          <div className='column is-half' style={{ height: '100%' }}>
            <h3 className='subtitle has-text-centered'>Kategori Koleksi</h3>
            <ResponsivePie
              data={dataKategori}
              margin={{ top: 40, right: 80, bottom: 150, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              colors={{ scheme: 'paired' }}
              borderColor={{
                  from: 'color',
                  modifiers: [
                      [
                          'darker',
                          0.2
                      ]
                  ]
              }}
              arcLinkLabel="label"
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsStraightLength = {11}
              arcLinkLabelsThickness={3}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                  from: 'color',
                  modifiers: [
                      [
                          'darker',
                          3
                      ]
                  ]
              }}
              legends={[
                {
                    anchor: 'bottom',
                    direction: 'column',
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 3,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000'
                            }
                        }
                    ]
                }
              ]}
            />
          </div>
        </div>
        <div className='columns' style={{ height: '350px' }}>
          <div className='column is-half' style={{height: "100%"}}>
            <h3 className='subtitle has-text-centered'>Jenis Cerita</h3>
            <ResponsiveBar
              data={dataJenisCerita}
              keys={[
                  'Total Koleksi'
              ]}
              indexBy="story_type"
              margin={{ top: 0, right: 0, bottom: 100, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'paired' }}
              borderColor={{
                  from: 'color',
                  modifiers: [
                      [
                          'darker',
                          1.6
                      ]
                  ]
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                  tickSize: 5,
                  tickPadding: 1,
                  tickRotation: 0,
                  legend: 'Jenis Cerita',
                  legendPosition: 'middle',
                  legendOffset: 32
              }}
              axisLeft={{
                  tickSize: 5,
                  tickPadding: 1,
                  tickRotation: 0,
                  legend: 'Total Koleksi',
                  legendPosition: 'middle',
                  legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                  from: 'color',
                  modifiers: [
                      [
                          'darker',
                          1.6
                      ]
                  ]
              }}
              role="application"
              ariaLabel="Bar"
              barAriaLabel={e=>e.id+": "+e.formattedValue+" in story_type: "+e.indexValue}
            />
          </div>
          <div className='column is-half' style={{height: "100%"}}>
            <h3 className='subtitle has-text-centered'>Bahasa</h3>
            <ResponsiveBar
              data={dataBahasa}
              keys={[
                  'Total Koleksi'
              ]}
              indexBy="language"
              margin={{ top: 0, right: 0, bottom: 100, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'category10' }}
              borderColor={{
                  from: 'color',
                  modifiers: [
                      [
                          'darker',
                          1.6
                      ]
                  ]
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                  tickSize: 5,
                  tickPadding: 1,
                  tickRotation: 0,
                  legend: 'Bahasa',
                  legendPosition: 'middle',
                  legendOffset: 32
              }}
              axisLeft={{
                  tickSize: 5,
                  tickPadding: 1,
                  tickRotation: 0,
                  legend: 'Total Koleksi',
                  legendPosition: 'middle',
                  legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                  from: 'color',
                  modifiers: [
                      [
                          'darker',
                          1.6
                      ]
                  ]
              }}
              role="application"
              ariaLabel="Bar"
              barAriaLabel={e=>e.id+": "+e.formattedValue+" in language: "+e.indexValue}
            />
          </div>
        </div>
        <div className='columns' style={{ height: '350px' }}>
          <div className='column is-fullWidth' style={{height: "100%"}}>
            <h3 className='subtitle has-text-centered'>Tahun Terbit Cetakan Pertama</h3>
            <ResponsiveBar
              data={dataTahunTerbit}
              keys={[
                  'Total Koleksi'
              ]}
              layout='horizontal'
              indexBy="publish_1st_year"
              margin={{ top: 0, right: 0, bottom: 100, left: 100 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'paired' }}
              borderColor={{
                  from: 'color',
                  modifiers: [
                      [
                          'darker',
                          1.6
                      ]
                  ]
              }}
              axisTop={null}
              axisRight={null}
              axisLeft={{
                  tickSize: 5,
                  tickPadding: 1,
                  tickRotation: 0,
                  legend: 'Tahun Terbit Cetakan Pertama',
                  legendPosition: 'middle',
                  legendOffset: -80
              }}
              axisBottom={{
                  tickSize: 5,
                  tickPadding: 1,
                  tickRotation: 0,
                  legend: 'Total Koleksi',
                  legendPosition: 'middle',
                  legendOffset: 32
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                  from: 'color',
                  modifiers: [
                      [
                          'darker',
                          1.6
                      ]
                  ]
              }}
              role="application"
              ariaLabel="Bar"
              barAriaLabel={e=>e.id+": "+e.formattedValue+" in publish_1st_year: "+e.indexValue}
            />
          </div>
        </div>
    </div>
  );
};

export default Welcome;
import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ResponsivePie } from '@nivo/pie';
import '../App.css';

const Welcome = () => {
    const {user} = useSelector((state) => state.auth);
    const [collections, setCollections] = useState([]);
    const [digitalData, setDigitalData] = useState([]);
    useEffect(()=>{
      getCollections();
    }, []);
    useEffect(()=>{
      getDigitalData();
    }, []);
    const navigate = useNavigate();
    const data = [
      { 
        "id" : "non-digital",
        "label" : "Belum ada data digital",
        "value" : collections.length,
        "color" : "hsl(246, 70%, 50%)"
       },
      { 
        "id" : "digital",
        "label" : "Sudah ada data digital",
        "value" : digitalData.length,
        "color" : "hsl(239, 70%, 50%)"
       },
    ];
  
    const getCollections = async () => {
      await axios.get('http://localhost:5000/collections')
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

    const getDigitalData = async () => {
      await axios.get('http://localhost:5000/digital-data')
        .then((response) => {
          setDigitalData(response.data);
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
  return (
    <div>
        <h1 className='title has-text-centered mt-3'>Dashboard</h1>
        <h2 className='subtitle has-text-centered'>Welcome Back <strong>{user && user.name}</strong></h2>
        <div className='columns' style={{ height: '350px' }}>
          <div className='column is-half' style={{ height: '100%' }}>
            <h3 className='subtitle has-text-centered'>Total Koleksi <strong>{collections.length}</strong></h3>
            <ResponsivePie
              data={data}
              margin={{ top: 0, right: 80, bottom: 150, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
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
              defs={[
                  {
                      id: 'dots',
                      type: 'patternDots',
                      background: 'inherit',
                      color: 'rgba(255, 255, 255, 0.3)',
                      size: 4,
                      padding: 1,
                      stagger: true
                  },
                  {
                      id: 'lines',
                      type: 'patternLines',
                      background: 'inherit',
                      color: 'rgba(255, 255, 255, 0.3)',
                      rotation: -45,
                      lineWidth: 6,
                      spacing: 10
                  }
              ]}
              fill={[
                  {
                      match: {
                          id: 'non-digital'
                      },
                      id: 'dots'
                  },
                  {
                      match: {
                          id: 'digital'
                      },
                      id: 'lines'
                  },
              ]}
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
          <div className='column is-half'>
           
          </div>
        </div>
    </div>
  );
};

export default Welcome;
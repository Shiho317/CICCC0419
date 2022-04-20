import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { UserService } from '../services/UserService';
import { IUser } from '../model/IUser';
import images from './UserImage.json';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker } from 'react-map-gl';
import { MdLocationPin } from 'react-icons/md';
import '../styles/UserDetails.style.css';

interface UserType {
  user: IUser;
  errorMessage: string;
  image: string;
}

const UserDetail: React.FC = () => {

  const [ user, setUser ] = useState<UserType>({
    user: {} as IUser,
    errorMessage: '',
    image: ''
  })

  const location = useLocation();
  
  useEffect(() => {

    const id = Number(location.pathname.replace('/userdetail/', ''));
    if(id){
      UserService.getAUser(id)
      .then(res => {
        setUser({
          ...user,
          user: res.data,
          image: images[id-1].image
        })
      })
      .catch(error => {
        setUser({
          ...user,
          errorMessage: error.message
        })
      })
    }else{
      setUser({
        ...user,
        errorMessage: "Couldn't find a user. Please try again."
      })
    }
  },[])

  const mapboxToken = process.env.REACT_APP_MAP_API;

  return (
    <>
    {user.user.name && 
    <div className='user-detail-body'>
      <div className='user-info'>
        <div className='user-image'>
          <img src={user.image} alt='user'/>
        </div>
        <div className='user-details'>
          <h1>{user.user.name}</h1>
          <h4><span>EMAIL:</span> {user.user.email}</h4>
          <h4><span>ADDRESS:</span> 
              {user.user.address.suite},
              {user.user.address.street},
              {user.user.address.city},
              {user.user.address.zipcode}
          </h4>
          <h4><span>PHONE:</span> {user.user.phone}</h4>
        </div>
      </div>
      <div className='company-info'>
        <div className='location'>
          <Map
            mapboxAccessToken={mapboxToken}
            initialViewState={{
            latitude: Number(user.user.address.geo.lat),
            longitude: Number(user.user.address.geo.lng),
            zoom: 1,
            }}
            style={{width: '20rem', height: '20rem'}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            <Marker
              latitude={Number(user.user.address.geo.lat)}
              longitude={Number(user.user.address.geo.lng)}
              anchor="bottom">
                <MdLocationPin
                  style={{fontSize: '2rem', color: 'gray'}}/>
            </Marker>
          </Map>
        </div>
        <div className='company-details'>
          <h3>Their Company</h3>
          <div className='company-comment'>
            <h4>&ldquo;{user.user.company.catchPhrase}&rdquo;</h4>
            <p>-{user.user.company.bs}-</p>
            <h4>WEBSITE: <a href='#'>{user.user.website}</a></h4>
          </div>
        </div>
      </div>
    </div>
    }
    </>
  )
}

export default UserDetail
// @flow

import React from 'react';
import {compose, withProps} from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';
import ToolTipMarker from './ToolTipMarker';
import libraryKeys from '../constants/libraryKeys';

export type Coordinate = {
  lat: number,
  lng: number,
};

type Props = {
  defaultCenter: Coordinate,
  defaultZoom?: number,
  markerPositionList?: Array<Coordinate>,
  showSearch: boolean,
  allowMarker: boolean,
  isEditing: boolean,

};

const DEFAULT_ZOOM = 15;

export function Maps(props: Props) {
  let {onClick, onUpdateMarker, defaultCenter, defaultZoom, markerPositionList, showSearch, allowMarker, isEditing, data} = props;
  let searchBoxRef;
  return (
    <GoogleMap
      defaultZoom={defaultZoom || DEFAULT_ZOOM}
      defaultCenter={defaultCenter}
      center={defaultCenter} 
      onClick={onClick}
    >
    {
      showSearch &&
        <SearchBox ref={(ref) => {searchBoxRef = ref;}} 
          controlPosition={google.maps.ControlPosition.TOP_LEFT} 
          onPlacesChanged={() => props.onPlacesChanged(searchBoxRef)}
        >
          <div className='google-searchbox-container'>
            <span><i className='material-icons'>menu</i></span>
            <input className='google-search-input' placeholder='Search Google Maps' type='text' />
            <span><i className='material-icons'>search</i></span>
            <span><i className='material-icons'>directions</i></span>  
          </div>
        </SearchBox>
    }
    {
      allowMarker &&
      <ToolTipMarker draggable={true} onDragEnd={onUpdateMarker} position={{lat: defaultCenter.lat, lng: defaultCenter.lng}}>
      {
        isEditing &&
        <InfoWindow>
          <div>
            <div><strong>Name:</strong> {data.name}</div>
            <div><strong>Address:</strong> {data.address}</div>
            <div><strong>Status:</strong> {data.status}</div>
          </div>
        </InfoWindow>
      }
      </ToolTipMarker>
    }
    {markerPositionList &&
      markerPositionList.map((markerPosition, index) => {
        return <Marker key={index} position={markerPosition} />;
      })}
    </GoogleMap>
  );
}

export default compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing,places&v=3.exp&key=${
      libraryKeys.googleMap.key
    }`,
    loadingElement: <div style={{height: `100%`}} />,
    containerElement: <div style={{height: `100%`}} />,
    mapElement: <div style={{height: `100%`}} />,
  }),
  withScriptjs,
  withGoogleMap,
)(Maps);

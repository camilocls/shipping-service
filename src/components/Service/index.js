import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import loadGoogleMapsApi from 'load-google-maps-api'
import { createService as dispatchCreateService } from '@/actions/index'
import { NavBar, Logo } from '@/components'
import { KEY_GMAPS } from '@/config/config'
import './style.scss'

class MapService extends Component {
  constructor() {
    super()
    this.googleMaps = null
    this.handleChange = this.handleChange.bind(this)
    this.handleCreateService = this.handleCreateService.bind(this)
  }

  state = {
    gMapsApiLoaded: false,
    message: '',
    service: {
      distance: null,
      duration: null,
      origin: null,
      destination: null,
      description: null,
      originPlaceId: null,
      destinationPlaceId: null,
    },
  }

  componentDidMount() {
    loadGoogleMapsApi({
      key: KEY_GMAPS,
      libraries: ['places'],
    })
      .then(googleMaps => {
        this.setState({ gMapsApiLoaded: true })
        this.googleMaps = googleMaps
        this.loadMap()
      })
      .catch(() => {
        // TODO: Handle error
      })
  }

  loadMap() {
    const { googleMaps } = this
    const map = new googleMaps.Map(document.querySelector('#map'), {
      center: {
        lat: 4.882504,
        lng: -70.96645,
      },
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoom: 5,
    })
    this.directionsService = new googleMaps.DirectionsService()
    this.directionsDisplay = new googleMaps.DirectionsRenderer()
    const originInput = document.getElementById('origin')
    const destinationInput = document.getElementById('destination')

    const originAutocomplete = new googleMaps.places.Autocomplete(originInput, {
      placeIdOnly: true,
    })
    const destinationAutocomplete = new googleMaps.places.Autocomplete(
      destinationInput,
      {
        placeIdOnly: true,
      },
    )

    this.map = map
    this.setupPlaceChangedListener(originAutocomplete, 'ORIG')
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST')
    this.directionsDisplay.setMap(map)
  }

  setupPlaceChangedListener(autocomplete, mode) {
    autocomplete.bindTo('bounds', this.map)
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.place_id) {
        // TODO: Handle error
        // console.error('Please select an option from the dropdown list.')
        this.setState({ message: 'Add a valid direction' })
        return
      }
      if (mode === 'ORIG') {
        this.setState(state => ({
          ...state,
          service: {
            ...state.service,
            origin: place.name,
            originPlaceId: place.place_id,
          },
        }))
      } else {
        this.setState(state => ({
          ...state,
          service: {
            ...state.service,
            destination: place.name,
            destinationPlaceId: place.place_id,
          },
        }))
      }
      this.route()
    })
  }

  route() {
    const { service } = this.state
    const { originPlaceId, destinationPlaceId } = service

    if (!originPlaceId || !destinationPlaceId) {
      return
    }
    this.directionsService.route(
      {
        origin: { placeId: originPlaceId },
        destination: { placeId: destinationPlaceId },
        travelMode: 'DRIVING',
      },
      (response, status) => {
        if (status === 'OK') {
          const route = response.routes[0].legs[0]
          this.setState(state => ({
            ...state,
            service: {
              ...state.service,
              duration: route.duration.text,
              distance: route.distance.text,
            },
          }))
          this.setState({ message: '' })
          this.directionsDisplay.setDirections(response)
        } else {
          // TODO: Handle error
          // console.error('Directions request failed due to ' + status)
          this.setState(state => ({
            ...state,
            service: {
              ...state.service,
              originPlaceId: null,
              destinationPlaceId: null,
            },
          }))
          this.setState({ message: 'Try again with a new direction or place.' })
        }
      },
    )
  }

  handleChange(event) {
    const { value, name } = event.target

    this.setState(state => ({
      ...state,
      service: {
        ...state.service,
        [name]: value,
      },
    }))
  }

  handleCreateService() {
    const { createService } = this.props
    const { service } = this.state

    this.setState({ message: 'The service has been created' })
    this.resetForm()
    createService(service)
  }

  validateServiceData() {
    const { service } = this.state
    const { originPlaceId, destinationPlaceId, description } = service

    return (
      originPlaceId !== null &&
      destinationPlaceId !== null &&
      description !== null
    )
  }

  resetForm() {
    this.setState(state => ({
      ...state,
      service: {
        distance: null,
        duration: null,
        origin: null,
        destination: null,
        description: null,
        originPlaceId: null,
        destinationPlaceId: null,
      },
    }))
  }

  render() {
    const { gMapsApiLoaded, service, message } = this.state
    const { services } = this.props

    return (
      <div className="container view view-service">
        <Logo />
        <NavBar />
        <div className="view-body">
          <h2 className="view__title">Create service</h2>

          {gMapsApiLoaded ? (
            <>
              <p className="view__description">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </p>
              <div className="view-service-map">
                <div className="view-service-map__left">
                  <div id="map" className="view-service__map" />
                </div>
                <div className="view-service-map__right">
                  <div className="view-service__services">
                    You have
                    <span className="view-service__services-count">
                      {services.length || 0}
                    </span>
                    services
                  </div>
                  <form className="view-service__form">
                    <label
                      className="view-service__label"
                      htmlFor="description"
                    >
                      <span className="view-service__label-text">
                        Description
                      </span>
                      <textarea
                        className="view-service__textarea"
                        id="description"
                        name="description"
                        value={service.description || ''}
                        required
                        onChange={this.handleChange}
                      />
                    </label>
                    <label className="view-service__label" htmlFor="origin">
                      <span className="view-service__label-text"> Origin </span>
                      <input
                        className="view-service__input"
                        id="origin"
                        name="origin"
                        required
                        value={service.origin || ''}
                        onChange={this.handleChange}
                        type="text"
                      />
                    </label>
                    <label
                      className="view-service__label"
                      htmlFor="destination"
                    >
                      <span className="view-service__label-text">
                        Destination
                      </span>
                      <input
                        className="view-service__input"
                        id="destination"
                        name="destination"
                        required
                        value={service.destination || ''}
                        onChange={this.handleChange}
                        type="text"
                      />
                    </label>
                    <button
                      type="button"
                      className="view-service__button"
                      onClick={this.handleCreateService}
                      disabled={!this.validateServiceData()}
                    >
                      Create service
                    </button>
                  </form>
                  <div className="view-service__message"> {message} </div>
                  <div className="view-service__data view-service-data">
                    <h3>Estimation of the route</h3>
                    <div className="view-service-data__item">
                      <span className="view-service-data__label">
                        Estimated distance:
                      </span>
                      {service.distance || 0}
                    </div>
                    <div className="view-service-data__item">
                      <span className="view-service-data__label">
                        Estimated dutarion:
                      </span>
                      {service.duration || 0}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="view-service__loading">Loading</div>
          )}
        </div>
      </div>
    )
  }
}

MapService.propTypes = {
  createService: PropTypes.func,
  services: PropTypes.array,
}

const mapStateToProps = state => ({ services: state.services })

const mapDispatchToProps = dispatch => ({
  createService: service => dispatch(dispatchCreateService(service)),
})

const Service = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapService)

export default Service

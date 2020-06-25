import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import { Link } from 'react-router-dom';


export default class Gallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      images: <div />,
      file: [],
      fileLoaded: 0,
      imageUploadForm: false
    }
    this.onDrop = this.onDrop.bind(this);
    this.toggleImageUpload = this.toggleImageUpload.bind(this)
    this.imageUpload = this.imageUpload.bind(this)
    this.populateImages = this.populateImages.bind(this)
  }
  onDrop(picture) {
    this.setState({
      file: this.state.file.concat(picture),
    });
    // console.log(this.state.file.length)
  }
  toggleImageUpload() {
    this.setState({ imageUploadForm: !this.state.imageUploadForm })
  }

  imageUpload = (e) => {
    // console.log(this.state.file)
    let uploadImagePromises = this.state.file.map(image => {
      let data = new FormData();
      data.append('image', image, image.name)
      // console.log("here")
      return axios.post(`/images/upload/${this.props.username}`, data);
    })
    // uploadImagePromises is now an array of promises for each image.
    // the following line says that wait for all promises to be fulfilled before going further
    axios.all(uploadImagePromises)
      .then((response) => {
        // console.log(response)
        this.populateImages()
        this.toggleImageUpload()
        this.componentDidMount()
        this.setState({ file: [] })
        // console.log(this.state, "\nImage state repopulated")
      })
      .catch(errors => {
        // console.log("errored")
        console.log(errors)
      })

  }

  componentDidMount() {
    this.populateImages()
    // console.log('Image State populated')
    // console.log(this.state.images)
  }

  populateImages = () => {
    axios.get(`/images/fetch/${this.props.username}`)
      .then((res) => {
        this.setState({ images: res.data.map((image, index) => <img key={index} src={image.url} alt={image._id} />) });
      })
      .catch(err => console.log('Loading' + err))
  }

  render() {
    // console.log(this.props.states)
    return (
      <div>
        <Link to="/" onClick={this.props.logoutFunc}>Logout</Link>
        <div>
          <button
            className={'btn btn-light centered'}
            onClick={this.props.gridToggle}>View as {this.props.gridView ? `List` : `Grid`}
          </button>
        </div>
        <div className={this.props.galleryStyle}>
          {this.state.images}
        </div>
        <div>
          <button type={'button'} id={'prev-page'} className={'btn btn-dark nav-button'}>Previous</button>
          <button type={'button'} id={'next-page'} className={'btn btn-primary nav-button'}>Next</button>
        </div>
        <button className={'btn nav-button'} onClick={this.toggleImageUpload}>
          {this.state.imageUploadForm ?
            <FaMinus /> : <FaPlus />}
        </button>
        {this.state.imageUploadForm ?
          <div>
            <ImageUploader
              withIcon={false}
              withPreview={true}
              className={'card card-body'}
              buttonClassName={'btn btn-secondary'}
              buttonText='Choose images'
              onChange={this.onDrop}
              label={'Max file size: 5 MB, Acceptable formats: JPEG, GIF, PNG'}
              imgExtension={['.jpg', '.gif', '.png']}
              maxFileSize={5242880}
            />
            <button onClick={this.imageUpload} className={'btn btn-secondary'}>Upload</button>
          </div> : null}
      </div>
    )
  }
}

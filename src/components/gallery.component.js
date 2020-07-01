import React from 'react';
import { FaUpload} from 'react-icons/fa';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

export default class Gallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      images: <div />,
      file: [],
      filesLoaded: 0,
      fileIndexPtr: 0,
      imageUploadForm: false
    }

    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.toggleImageUpload = this.toggleImageUpload.bind(this)
    this.imageUpload = this.imageUpload.bind(this)
    this.populateImages = this.populateImages.bind(this)
  }
  nextPage() {
    this.setState({
      fileIndexPtr: this.state.fileIndexPtr < this.state.filesLoaded ? (this.state.fileIndexPtr + 9) : this.state.fileIndexPtr
    })
    this.populateImages()
  }
  prevPage() {
    this.setState({
      fileIndexPtr: this.state.fileIndexPtr > 0 ? (this.state.fileIndexPtr - 9) : 0
    })
    this.populateImages()
  }

  onDrop(picture) {
    this.setState({
      file: this.state.file.concat(picture),
    });
    // console.log(this.state.file.length)
  }
  toggleImageUpload(event) {
    this.setState({ imageUploadForm: !this.state.imageUploadForm })
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function () {
      modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    }
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
        this.componentDidMount()
        console.log(this.state.file)
        this.setState({ file: [] })
        window.location.reload()
        // var modal = document.getElementById("myModal");
        // modal.style.display = "none";
      })
      .catch(errors => {
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
        this.setState({
          images: res.data.slice(this.state.fileIndexPtr,
            this.state.fileIndexPtr + 9)
            .map((image, index) => <img key={index} src={image.url} alt={image._id} />),
          filesLoaded: 30
        });
      })
      .catch(err => console.log('Loading' + err))
  }

  render() {
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
          <button
            onClick={this.prevPage}
            type={'button'}
            id={'prev-page'}
            className={'btn btn-dark nav-button'}
            disabled={this.state.fileIndexPtr <= 0 ? true : false}
          >
            Previous
          </button>
          <button
            onClick={this.nextPage}
            type={'button'}
            id={'next-page'}
            className={'btn btn-primary nav-button'}
            disabled={this.state.fileIndexPtr > this.state.filesLoaded ? true : false}
          >
            Next
          </button>
        
        <button className={'btn btn-success nav-button'} id={'myBtn'} onClick={this.toggleImageUpload}>
          <FaUpload />
        </button>
        <div id={'myModal'} className={'modal'}>
          <div className={'modal-content'}>
            <span className="close">&times;</span>
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
          </div>
        </div>
      </div>
      </div>
    )
  }
}

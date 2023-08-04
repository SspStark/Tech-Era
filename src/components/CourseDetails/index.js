import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CourseDetails extends Component {
  state = {courseData: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getCourseDetails()
  }

  getCourseDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {id} = match.params
    const response = await fetch(`https://apis.ccbp.in/te/courses/${id}`)
    if (response.ok) {
      const data = await response.json()
      const formattedData = {
        id: data.course_details.id,
        courseName: data.course_details.name,
        imageUrl: data.course_details.image_url,
        description: data.course_details.description,
      }
      this.setState({
        courseData: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="Oval" color="#0b69ff" height="50" width="50" />
    </div>
  )

  retryCourseDetails = () => this.getCourseDetails()

  renderCourseDetailsFailure = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.retryCourseDetails}
      >
        Retry
      </button>
    </div>
  )

  renderCourseDetailsView = () => {
    const {courseData} = this.state
    const {courseName, imageUrl, description} = courseData

    return (
      <div className="course-container">
        <img src={imageUrl} alt={courseName} className="course-image" />
        <div className="details-container">
          <h1 className="course-heading">{courseName}</h1>
          <p className="description">{description}</p>
        </div>
      </div>
    )
  }

  renderCourseItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCourseDetailsView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderCourseDetailsFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="course-item-details">
          {this.renderCourseItemDetails()}
        </div>
      </>
    )
  }
}

export default CourseDetails

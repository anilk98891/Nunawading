import RestClient from 'react-native-rest-client';
import constants from '../Constants/ConstantClass'

export default class YourRestApi extends RestClient {
  
  constructor () {
    // Initialize with your base URL
    super(constants.BASE_URL)
    this.state={
      taskId : ""
    }
  }

  login (email, password,country_code,device_type,push_token,device_id) {
    // Returns a Promise with the response.
    return this.POST('/users/login', { email, password,country_code,device_type,push_token,device_id });
  }

  getEventsData() {
    // If the request is successful, you can return the expected object
    // instead of the whole response.
    return this.GET('calendar/v3/calendars/busywizzy1@gmail.com/events?key='+ constants.GoogleKeys.GoogleAPIKeys)
      .then(response => response);
  }

  getTasksData() {
    return this.GET('tasks/v1/users/@me/lists?key='+ constants.GoogleKeys.GoogleAPIKeys)
      .then(response => response);
  }

  getAdminAuthToken() {
    return this.GET('oauth2/v4/token' + this.state.taskId + '/tasks?key='+ constants.GoogleKeys.GoogleAPIKeys)
      .then(response => response);
  }

  getSubTasksData() {
    return this.GET('tasks/v1/lists/' + this.state.taskId + '/tasks?key='+ constants.GoogleKeys.GoogleAPIKeys)
      .then(response => response);
  }

  getDriveData() {
    console.log(this.headers)
    return this.GET('drive/v2/files')
    .then(response => response);
  }
};

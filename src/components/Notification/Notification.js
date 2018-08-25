import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Notification.css';

export default class Notification extends Component {
  static propTypes = {
    notification: PropTypes.object,
    onNotificationClose: PropTypes.func
  };

  static defaultProps = {
    notification: '',
    onNotificationClose: () => {}
  };


  render() {
    const { notification, onNotificationClose } = this.props;

    return (
      <div
        className={`notification-container ${notification && notification.type}`}
        onClick={() => onNotificationClose()}
      >
        <div className="notification-text">{notification && notification.message}</div>
        <div className="close-button">×</div>
      </div>
    );
  }
}

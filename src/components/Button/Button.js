import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ title, onClick, isToRender = true }) => {
  if (isToRender) {
    return (
      <div
        className="button"
        onClick={() => onClick()}
      >
        {title}
      </div>
    );
  }
  return (
    <div className="hidden-button" />
  );
};

Button.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  isToRender: PropTypes.bool
};

export default Button;

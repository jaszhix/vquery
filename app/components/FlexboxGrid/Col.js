
import React from 'react';

var Col = React.createClass({
  render() {
    let {auto, xs, sm, md, lg, className} = this.props;
    if (auto) {
        className = 'col-xs';
    } else {
      className = className || '';
      if (xs) {
          className += ' col-xs-' + xs;
      }
      if (sm) {
          className += ' col-sm-' + sm;
      }
      if (md) {
          className += ' col-md-' + md;
      }
      if (lg) {
          className += ' col-lg-' + lg;
      }
    }
    return (
      <div {...this.props} className={className}>
          { this.props.children }
      </div>
    );
  }
});

export default Col;
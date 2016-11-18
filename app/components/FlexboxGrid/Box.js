import React from 'react';

var Box = React.createClass({
  render() {
    return (
      <div {...this.props} className="box">
          { this.props.children }
      </div>
    );
  }
});

export default Box;
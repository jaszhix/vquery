import React from 'react';

var Row = React.createClass({
  render() {
    let className = 'row ' + this.props.className;
    return (
      <div {...this.props} className={className}>
        {this.props.children}
      </div>
    );
  }
});

export default Row;
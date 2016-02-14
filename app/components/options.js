import React from 'react';
import _ from 'lodash';
import {TextField} from 'material-ui';
import {appTheme} from '../stores/main';

var Options = React.createClass({
  render: function() {
    var _appTheme = appTheme.get();
    return (
      <div className="Options">
      {_.keys(appTheme.get().palette).map((key, i)=>{
        return <TextField style={{backgroundColor: _appTheme.palette[key]}} key={i} value={_appTheme.palette[key]} underlineFocusStyle={{borderColor: _appTheme.palette[key]}} underlineStyle={{borderColor: _appTheme.palette[key]}} onChange={(e)=>appTheme.set(key, e.target.value)} floatingLabelText={key} hintText={key} />;
      })}
      </div>
    );
  }
});

export default Options;

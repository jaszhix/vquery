import Reflux from 'reflux';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';

export var appTheme = Reflux.createStore({
  init(){
    this.theme = {
      spacing: Spacing,
      zIndex: zIndex,
      fontFamily: 'Roboto, sans-serif',
      palette: {
        primary1Color: '#BFE2EC',
        primary2Color: '#4D4F48',
        primary3Color: '#62645D',
        accent1Color: '#5F6259',
        accent2Color: '#4D4F48',
        accent3Color: '#BFE2EC',
        textColor: '#FFF',
        alternateTextColor: 'rgba(255, 255, 255, 0.81)',
        canvasColor: '#4D4F48',
        borderColor: '#62645D',
        disabledColor: '#969696',
        pickerHeaderColor: '#62645D',
      }
    };
    this.trigger(this.appTheme);
  },
  set(prop, value){
    this.theme.palette[prop] = value;
    this.trigger(this.theme);
  },
  get(){
    return this.theme;
  }
});

export var search = Reflux.createStore({
  init(){
    this.search = '';
  },
  set(value){
    this.search = value;
    this.trigger(this.search);
  },
  get(){
    return this.search;
  }
});
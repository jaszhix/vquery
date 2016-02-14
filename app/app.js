import './assets/styles/app.scss';
import Logo from './assets/images/logo_white.png';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';
import Reflux from 'reflux';
import _ from 'lodash';
import v from 'vquery';
window.v = v;
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();
// Material UI
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import { Paper, MenuItem, FlatButton, Toolbar, ToolbarGroup, Card, CardTitle, CardText, List, ListItem,  } from 'material-ui';
import ArrowUpward from 'material-ui/lib/svg-icons/navigation/arrow-upward';
import Row from './components/FlexboxGrid/Row.js';
import Col from './components/FlexboxGrid/Col.js';
import Box from './components/FlexboxGrid/Box.js';
// Stores
import {appTheme} from './stores/main';
import Options from './components/options';

const publicPath = '/vquery/';
var _appTheme = appTheme.get();
const styles = {
  logo: {width: '25%', marginTop: '10px', marginLeft: '15px', cursor: 'pointer'},
  menu: {float: 'left', position: 'relative', zIndex: '0'},
  menuButton: {width: '30px', height: '30px', marginTop: '13px', marginLeft: '10px', marginRight: '10px', cursor: 'pointer'},
  leftSidebar: {paddingLeft: '0', paddingTop: '0'},
  removeScriptButton: {float: 'right', marginTop: '11px'},
  toolbarTitle: {color: _appTheme.palette.textColor, zIndex: '9999', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, paddingTop: 0, letterSpacing: 0, fontSize: 24},
  toolbarRow: {marginBottom: '15px'},
  flatButton: {color: _appTheme.palette.textColor},
  flatButtonFontAwesome: {position: 'relative', left: '8px'},
  underlineStyle: {borderColor: '#77959D'},
  floatingLabelStyle: {color: 'rgb(191, 226, 236)'},
  rowContent: {marginLeft: '8px', marginRight: '8px'},
  content: {
    list: {paddingTop: '0', paddingBottom: '0'},
    card: {paddingLeft: '8px', marginBottom: '15px'},
    cardTitle: {color: _appTheme.palette.textColor},
    cardText: {paddingTop: '0', paddingBottom: '0'},
    box: {marginBottom: '15px'}
  }
};

var ContentBox = React.createClass({
  getInitialState(){
    return {
      scrollTop: false
    };
  },
  componentWillReceiveProps(nextProps){
    var p = this.props;
    if (p.scrollTop !== nextProps.scrollTop) {
      var el = v(this.refs.html).find(`#${nextProps.scrollTop}`).attr();
      if (el && nextProps.scrollTop === el.id) {
        this.setState({scrollTop: true});
      }
    }
  },
  handleScrollTop(){
    v('#main').n.scrollIntoView();
    this.setState({scrollTop: false});
  },
  render: function() {
    var p = this.props;
    var s = this.state;
    function createMarkup() { return {__html: p.content};}
    return (
        <Card style={styles.content.card}> 
          <Row className="content-box"> 
            <CardText expandable={false} style={styles.content.cardText}>
              <div ref="html">
                <p> 
                  <span dangerouslySetInnerHTML={createMarkup()} /> 
                  {s.scrollTop ? 
                    <FlatButton
                      icon={<ArrowUpward color="#FFF" />}
                      label="Go Back"
                      labelPosition="after"
                      style={styles.flatButton}
                      primary={true}
                      onTouchTap={this.handleScrollTop} /> : null}
                </p> 
              </div>
            </CardText> 
          </Row> 
        </Card> 
    );
  }
});

var Docs = React.createClass({
  getInitialState(){
    return {
      api: require('html!markdown!./api.md')
    };
  },
  scrollToDoc(id){
    console.log(id)
    v(`#${id}`).n.scrollIntoView()
    this.setState({scrollTop: id})
  },
  handleLinkClick(e, id, title){
    console.log(e, id, title);
  },
  render() {
    var s = this.state;
    var docs = s.api.split('[Break]');
    var div = document.createElement("div");
    div.innerHTML = s.api;

    var methods = [];
    v(div).find('h4').map(function(title){
      methods.push({title: v(title).text()[0].replace('[Break]','').replace(/ *\([^)]*\)*\) */g, ''), id: v(title).attr().id});
    })
    return (
      <Row style={styles.rowContent}> 
        <Col md="2" > 
          <Box> 
            <Card> 
              <List style={styles.content.list}> 
                {methods.map((method, i)=>{
                  return <ListItem key={i} primaryText={method.title} onTouchTap={()=>this.scrollToDoc(method.id)}/>;
                })}
              </List> 
            </Card> 
          </Box> 
        </Col> 
        <Col auto={true} > 
          {docs.map((doc, i)=>{
            return <ContentBox key={i} scrollTop={s.scrollTop} content={doc}/>;
          })}
        </Col> 
      </Row>
    );
  }
});

var Index = React.createClass({
  render: function() {
    return (
      <div className="Index">
        Test
      </div>
    );
  }
});

var Bar = React.createClass({
  getInitialState(){
    return {
      leftNavOpen: false
    };
  },
  handleMenu(){
    this.setState({leftNavOpen: !this.state.leftNavOpen});
  },
  contextTypes: {
    route: React.PropTypes.object,
    router: React.PropTypes.object.isRequired
  },
  render: function() {
    var s = this.state;
    var r = this.context.router;
    return (
      <Row style={styles.toolbarRow} >
        <Toolbar>
          <ToolbarGroup firstChild={true} float="left">
            <img src={Logo} style={styles.logo} onTouchTap={()=>r.push(publicPath)} />
          </ToolbarGroup>
          <ToolbarGroup float="right">
            <FlatButton        
              label="Github"
              labelPosition="after"
              style={styles.flatButton}
              primary={true}
              onTouchTap={()=>window.location.href = "https://github.com/jaszhix/vquery"}>
              <i style={styles.flatButtonFontAwesome} className="fa fa-github"/>
              </FlatButton>
          </ToolbarGroup>
        </Toolbar>
      </Row>
    );
  }
});

var Root = React.createClass({
  mixins: [Reflux.ListenerMixin],
  getInitialState(){
    return {
      appTheme: appTheme.get()
    };
  },
  componentDidMount(){
    // Reflux listeners
    this.listenTo(appTheme, this.appThemeChange);
  },
  contextTypes: {
    route: React.PropTypes.object,
    router: React.PropTypes.object.isRequired
  },
  childContextTypes : {
    muiTheme: React.PropTypes.object,
    route: React.PropTypes.object,
  },
  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(this.state.appTheme),
      route: this.props.route
    };
  },
  appThemeChange(e){
    this.setState({appTheme: e});
  },
  render: function() {
    var s = this.state;
    return (
      <div className="Root">
        <Bar {...this.props} appTheme={s.appTheme} />
        {this.props.children}
      </div>
    );
  }
});
ReactDOM.render((
  <Router history={browserHistory} >
    <Route path={publicPath} component={Root}>
      <IndexRoute component={Docs} />
      <Route path={`${publicPath}options`} component={Options} />
    </Route>
  </Router>
  ), document.getElementById('main'));

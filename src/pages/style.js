import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  root: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 50,
  },
  pageTitle: {
    marginLeft: 120,
  },
  breadCrumbs: {
    float: 'left',
    color: '#323990',
    fontSize: 14,
  },
  titleWrapper: {
    fontSize: window.innerWidth >= 1024 ? 26 : 15,
    fontWeight: 'bold',
    marginTop: window.innerWidth >= 1024 ? 0 : 10,
    marginBottom: 0,
  },
});

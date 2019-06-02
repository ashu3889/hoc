import React from 'react';
import {Link} from 'react-router-dom';
import {Toolbar, Typography, Tooltip, IconButton, Button, Icon} from 'material-ui';
import {Add,InsertDriveFile} from 'material-ui-icons';
import classNames from 'classnames';
import DeleteIcon from 'material-ui-icons/Delete';
import FilterListIcon from 'material-ui-icons/FilterList';
import withStyles from 'material-ui/styles/withStyles';
import SearchField from '../Searchfield';

const toolbarStyles = (theme) => ({
  root: {
    paddingRight: 2,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.dark,
          //   backgroundColor: lighten(theme.palette.secondary.light, 0.4),
        }
      : {
          //   color: lighten(theme.palette.secondary.light, 0.4),
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  // classNam
});

let EnhancedTableToolbar = (props) => {
  const {numSelected, classes, url, entity, handleChange, onNewClick, searchKey} = props;
  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.spacer} />
      <SearchField handleChange={handleChange} defaultValue={searchKey || ''} />
      <Button
        variant="raised"
        style={{margin: '0% 1%'}}
        color="primary"
        component={Link}
        to={`${url}/${entity}/create`}
      >
        <Add />&nbsp;New
      </Button>
      <Button
        variant="raised"
        style={{margin: '0% 1%', padding: '10px 20px'}}
        color="primary"
        component={Link}
        to={`${url}/${entity}/create`}
      >
        <InsertDriveFile />&nbsp;Export
      </Button>
    </Toolbar>
  );
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);
export default EnhancedTableToolbar;

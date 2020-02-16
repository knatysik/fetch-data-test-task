import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { fade, makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'

const API_URL = 'https://jsonplaceholder.typicode.com/todos'
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  container: {
    maxHeight: 'calc(100vh - 65px)',
  },
}))

function SortableTableCell({ name, label, orderBy, order, onRequestSort }) {
  return (
    <TableCell sortDirection={orderBy === name ? order : false}>
      <TableSortLabel
        active={orderBy === name}
        direction={orderBy === name ? order : 'asc'}
        onClick={() => {
          onRequestSort(name)
        }}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  )
}

function Posts() {
  const classes = useStyles()
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [orderBy, setOrderBy] = useState(null)
  const [order, setOrder] = useState('desc')

  const getData = useCallback(async () => {
    const response = await axios.get(API_URL)
    setPosts(response.data)
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }
    return 0
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy)
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0])
      if (order !== 0) return order
      return a[1] - b[1]
    })
    return stabilizedThis.map(el => el[0])
  }

  const handleRequestSort = useCallback(
    property => {
      const isAsc = orderBy === property && order === 'asc'
      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(property)
    },
    [orderBy, order],
  )

  return (
    <Container fixed>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Posts
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              id="standard-search"
              label="Search field"
              type="search"
              onChange={e => setSearch(e.target.value)}
              value={search}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader className={classes.table} aria-label="sticky table">
            <TableHead>
              <TableRow>
                <SortableTableCell
                  label="ID"
                  name="userId"
                  orderBy={orderBy}
                  order={order}
                  onRequestSort={handleRequestSort}
                />
                <SortableTableCell
                  label="Title"
                  name="title"
                  orderBy={orderBy}
                  order={order}
                  onRequestSort={handleRequestSort}
                />
                <SortableTableCell
                  label="completed"
                  name="completed"
                  orderBy={orderBy}
                  order={order}
                  onRequestSort={handleRequestSort}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(posts, getComparator(order, orderBy))
                .filter(post => {
                  const regexp = new RegExp(search)
                  return regexp.test(post['title'])
                })
                .map(post => (
                  <TableRow hover key={post.id}>
                    <TableCell component="th" scope="row">
                      {post.userId}
                    </TableCell>
                    <TableCell align="left">{post.title}</TableCell>
                    <TableCell align="left">{post.completed && 'completed'}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  )
}

export default Posts

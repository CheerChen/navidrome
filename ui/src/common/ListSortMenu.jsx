import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, useListContext, useTranslate } from 'react-admin'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import SortIcon from '@material-ui/icons/Sort'
import CheckIcon from '@material-ui/icons/Check'

export const ListSortMenu = ({ choices }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const translate = useTranslate()
  const { currentSort, setSort } = useListContext()
  const open = Boolean(anchorEl)

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = ({ field, order }) => {
    setSort(field, order)
    handleClose()
  }

  return (
    <>
      <Button
        label={translate('ra.action.sort', { _: 'Sort' })}
        onClick={handleOpen}
        disabled={!setSort}
      >
        <SortIcon />
      </Button>
      <Menu anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
        {choices.map((choice) => {
          const selected =
            currentSort?.field === choice.field &&
            currentSort?.order === choice.order
          return (
            <MenuItem
              key={`${choice.field}-${choice.order}`}
              selected={selected}
              onClick={() => handleSelect(choice)}
            >
              <ListItemIcon>{selected && <CheckIcon />}</ListItemIcon>
              <ListItemText primary={choice.label} />
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

ListSortMenu.propTypes = {
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      order: PropTypes.oneOf(['ASC', 'DESC']).isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

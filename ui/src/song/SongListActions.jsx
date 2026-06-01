import React, { cloneElement } from 'react'
import { sanitizeListRestProps, TopToolbar } from 'react-admin'
import { useMediaQuery } from '@material-ui/core'
import { ListSortMenu, ShuffleAllButton, ToggleFieldsMenu } from '../common'

const songSortChoices = [
  { field: 'title', order: 'ASC', label: 'Title' },
  { field: 'artist', order: 'ASC', label: 'Artist' },
  { field: 'album', order: 'ASC', label: 'Album' },
  { field: 'year', order: 'DESC', label: 'Year, newest first' },
  { field: 'year', order: 'ASC', label: 'Year, oldest first' },
  { field: 'recently_added', order: 'DESC', label: 'Recently added' },
  { field: 'play_date', order: 'DESC', label: 'Recently played' },
  { field: 'play_count', order: 'DESC', label: 'Most played' },
  { field: 'rating', order: 'DESC', label: 'Rating' },
  { field: 'starred_at', order: 'DESC', label: 'Favorites' },
]

export const SongListActions = ({
  currentSort,
  className,
  resource,
  filters,
  displayedFilters,
  filterValues,
  permanentFilter,
  exporter,
  basePath,
  selectedIds,
  onUnselectItems,
  showFilter,
  maxResults,
  total,
  ids,
  ...rest
}) => {
  const isNotSmall = useMediaQuery((theme) => theme.breakpoints.up('sm'))
  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      <ShuffleAllButton filters={filterValues} />
      {filters &&
        isNotSmall &&
        cloneElement(filters, {
          resource,
          showFilter,
          displayedFilters,
          filterValues,
          context: 'button',
        })}
      {isNotSmall ? (
        <ToggleFieldsMenu resource="song" />
      ) : (
        <ListSortMenu choices={songSortChoices} />
      )}
    </TopToolbar>
  )
}

SongListActions.defaultProps = {
  selectedIds: [],
  onUnselectItems: () => null,
}

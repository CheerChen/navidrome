package nativeapi

import (
	"context"

	"github.com/deluan/rest"
	"github.com/navidrome/navidrome/model"
)

const defaultAlbumShuffleLimit = 500

type albumShuffleRepository struct {
	albumRepo rest.Repository
	songRepo  rest.Repository
}

func newAlbumShuffleRepository(ds model.DataStore) rest.RepositoryConstructor {
	return func(ctx context.Context) rest.Repository {
		return &albumShuffleRepository{
			albumRepo: ds.Resource(ctx, model.Album{}),
			songRepo:  ds.Resource(ctx, model.MediaFile{}),
		}
	}
}

func (r *albumShuffleRepository) Count(options ...rest.QueryOptions) (int64, error) {
	albumIds, err := r.albumIDs(options...)
	if err != nil || len(albumIds) == 0 {
		return 0, err
	}
	return r.songRepo.Count(rest.QueryOptions{
		Filters: map[string]any{
			"album_id": albumIds,
			"missing":  "false",
		},
	})
}

func (r *albumShuffleRepository) Read(id string) (any, error) {
	return r.songRepo.Read(id)
}

func (r *albumShuffleRepository) ReadAll(options ...rest.QueryOptions) (any, error) {
	albumIds, err := r.albumIDs(options...)
	if err != nil || len(albumIds) == 0 {
		return model.MediaFiles{}, err
	}

	limit := defaultAlbumShuffleLimit
	if len(options) > 0 && options[0].Max > 0 {
		limit = options[0].Max
	}

	return r.songRepo.ReadAll(rest.QueryOptions{
		Max:   limit,
		Sort:  "random",
		Order: "ASC",
		Filters: map[string]any{
			"album_id": albumIds,
			"missing":  "false",
		},
	})
}

func (r *albumShuffleRepository) EntityName() string {
	return "albumShuffle"
}

func (r *albumShuffleRepository) NewInstance() any {
	return &model.MediaFile{}
}

func (r *albumShuffleRepository) albumIDs(options ...rest.QueryOptions) ([]string, error) {
	var albumOptions rest.QueryOptions
	if len(options) > 0 {
		albumOptions.Filters = options[0].Filters
	}

	albums, err := r.albumRepo.ReadAll(albumOptions)
	if err != nil {
		return nil, err
	}

	albumList, ok := albums.(model.Albums)
	if !ok {
		return nil, nil
	}

	ids := make([]string, 0, len(albumList))
	for _, album := range albumList {
		if !album.Missing {
			ids = append(ids, album.ID)
		}
	}
	return ids, nil
}

const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: (request, h) => handler.postPlaylistHandler(request, h),
        options: {
            auth: 'open_music_jwt'
        }
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: (request, h) => handler.getUserPlaylistsHandler(request, h),
        options: {
            auth: 'open_music_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}',
        handler: (request, h) => handler.deletePlaylistByIdHandler(request, h),
        options: {
            auth: 'open_music_jwt'
        }
    },
    {
        method: 'POST',
        path: '/playlists/{playlistId}/songs',
        handler: (request, h) => handler.postSongPlaylistByIdHandler(request, h),
        options: {
            auth: 'open_music_jwt'
        }
    },
    {
        method: 'GET',
        path: '/playlists/{playlistId}/songs',
        handler: (request, h) => handler.getSongPlaylistHandler(request, h),
        options: {
            auth: 'open_music_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}/songs',
        handler: (request, h) => handler.deleteSongInPlaylistHandler(request, h),
        options: {
            auth: 'open_music_jwt'
        }
    }
]

module.exports = routes
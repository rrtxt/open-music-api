const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: (request, h) => handler.postSongsHandler(request, h)
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (request, h) => handler.getAllSongsHandler(request, h)
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (request, h) => handler.getSongByIdHandler(request, h)
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (request, h) => handler.editSongByIdHandler(request, h)
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (request, h) => handler.deleteSongByIdHandler(request, h)
  },
]

module.exports = routes

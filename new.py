import openrouteservice as ors

lat1, lon1 = 24.57784394195272, 46.53168840746275
lat2, lon2 = 24.59784394195272, 46.53168840746275
lat3, lon3 = 24.61784394195272, 46.53168840746275

coords = [(lat1, lon1), (lat2, lon2), (lat3, lon3)]

client = ors.Client('5b3ce3597851110001cf62489e4d077cabd84d33bf9c6992a077bfac')
routes = client.directions(coords, profile='foot-walking')

print(routes)

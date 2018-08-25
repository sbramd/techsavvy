export default (url, instance) => {
	return {
		getOne: id =>
			instance.get(`${url}/${id}`, {
				// timeout: 5000
			}),
		getAll: (seed, page, limit) => instance.get(`${url}?page=${page}&limit=${limit}`),
		update: (id, updateData) => instance.patch(`${url}/${id}`, updateData),
		create: createData => instance.post(url, createData),
		delete: id => instance.delete(`${url}/${id}`),
		clap: id => instance.post(`${url}/${id}/clap`),
		unclap: id => instance.post(`${url}/${id}/unclap`),
		getAllComments: id => instance.get(`${url}/${id}/comments`)
	};
};
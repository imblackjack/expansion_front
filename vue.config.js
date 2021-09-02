module.exports = {
	lintOnSave: false,
	devServer: {
		proxy: {
			'/v1': {
				target: 'http://localhost:8000', // target host
				ws: true, // proxy websockets
				changeOrigin: true, // needed for virtual hosted sites
				pathRewrite: {
					'^/v1': '/v1' // rewrite path
				}
			},
			
			'/dtree': {
				target: 'http://dtree.pe.dapp.com', // target host
				ws: true, // proxy websockets
				changeOrigin: true, // needed for virtual hosted sites
				pathRewrite: {
					'^/dtree': '' // rewrite path
				}
			},
			
		},


	}
};

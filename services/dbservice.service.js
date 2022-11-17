const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
require("dotenv").config();

module.exports = {
	name: "dbservice",
	mixins: [DbService],
	adapter: new SqlAdapter(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
		host: "localhost",
		dialect: "postgres",

		// pool: {
		// 	max: 5,
		// 	min: 0,
		// 	idle: 10000,
		// },

		// SQLite only
		// storage: 'path/to/database.sqlite'
	}),
	model: {
		name: "post",
		define: {
			title: Sequelize.STRING,
			content: Sequelize.TEXT,
			votes: Sequelize.INTEGER,
			author: Sequelize.INTEGER,
			status: Sequelize.BOOLEAN,
		},
		options: {
			// Options from http://docs.sequelizejs.com/manual/tutorial/models-definition.html
		},
	},

	actions: {
		// adding posts
		adddingposts: {
			rest: {
				method: "POST",
				path: "/addarticle",
			},
			params: {
				// con :{type: "string"},
			},

			async handler(ctx) {
				const { title, content, votes } = ctx.params;
				const obj = {
					title,
					content,
					votes,
					author: 1,
					status: true,
				};

				const res = await this.adapter.insert(obj);
				return await this.transformDocuments(ctx, {}, res);
			},
		},

		gettingallposts: {
			rest: {
				method: "GET",
				path: "/getallarticles",
			},
			async handler() {
				return this.adapter.find();
			},
		},

		// getting posts
		gettingposts: {
			rest: {
				method: "GET",
				path: "/getarticle",
			},

			// params: {
			// 	id: ""
			// },

			async handler(ctx) {
				const id = Number(ctx.params.id);
				// return typeof(id);
				return this.adapter.findById(id);
			},
		},

		// deleting posts
		deletingposts: {
			rest: {
				method: "DELETE",
				path: "/deletearticle",
			},

			async handler() {
				return this.adapter.removeById(1);
			},
		},

		// update posts
		updatingposts: {
			rest: {
				method: "PUT",
				path: "/updatearticle",
			},

			async handler() {
				return this.adapter.updateById(4, {
					$set: {
						title: "title12222",
						content: null,
						votes: 2,
						author: 1,
						status: true,
					},
				});
			},
		},
	},
};

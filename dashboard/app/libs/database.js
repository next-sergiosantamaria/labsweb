class Database {
	constructor(sdk) {
		this.config = {
			apiKey: "AIzaSyCal5JwytwBtJYw6cbkYKEA71bUt0dxfsM",
			authDomain: "beeweb-192310.firebaseapp.com",
			databaseURL: "https://beeweb-192310.firebaseio.com",
			projectId: "beeweb-192310",
			storageBucket: "",
			messagingSenderId: "263408493667"
		};

		this.database = sdk.database();
	}

	get(ref, callback, error) {
		this.database.ref(ref)
			.orderByKey()
			.on("value", (res) => {
				callback(res.val());
			});
	}

	put(ref, key, data, callback, error) {
		let _ref = `${ ref }/${ key }`;
		this.database.ref(_ref)
			.set(data)
			.then(callback)
			.catch(error);
	}

	append(ref, data, callback, error) {
		let table = this.database.ref(ref);

		table.push()
			.then(() => {
				table.set(data)
					.then(callback)
					.catch(error);	
			})
			.catch(error);
	}

	update(ref, key, data, callback, error) {
		let _ref = `${ ref }/${ key }`;
		this.database.ref(ref)
			.remove()
			.then(() => {
				this.database.ref(ref)
					.set(data)
					.then(callback)
					.catch(error);
			})
			.catch(error);
	}

	remove(ref, callback, error) {
		this.database.ref(ref)
			.remove()
			.then(callback)
			.catch(error);
	}
}
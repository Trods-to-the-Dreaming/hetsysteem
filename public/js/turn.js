export const turn = {
	storage: {
		load(key, defaultValue = null) {
			const value = localStorage.getItem(`turn.${key}`);
			return value !== null ? JSON.parse(value) : defaultValue;
		},

		save(key, value) {
			localStorage.setItem(`turn.${key}`, JSON.stringify(value));
		},

		remove(key) {
			localStorage.removeItem(`turn.${key}`);
		},
		
		loadNamespace(namespace) {
			const object = {};
			const prefix = `turn.${namespace}.`;
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key.startsWith(prefix)) {
					const prop = key.slice(prefix.length);
					object[prop] = this.load(`${namespace}.${prop}`);
				}
			}
			return object;
		},
		
		saveNamespace(namespace, obj) {
			Object.entries(obj).forEach(([prop, value]) => {
				this.save(`${namespace}.${prop}`, value);
			});
		},
		
		removeNamespace(namespace) {
			const prefix = `turn.${namespace}.`;
			for (let i = localStorage.length - 1; i >=0 ; i--) {
				const key = localStorage.key(i);
				if (key.startsWith(prefix)) {
					localStorage.removeItem(key);
				}
			}
		},
		
		removeAll() {
			for (let i = localStorage.length - 1; i >=0 ; i--) {
				const key = localStorage.key(i);
				if (key.startsWith('turn.')) {
					localStorage.removeItem(key);
				}
			}
		}
	},
	
	phase: {}
};
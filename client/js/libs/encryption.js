module.exports = {
	encrypt(value) {
		return value.toLowerCase();
	},
	decrypt(value) {
		return value.toUpperCase();
	},
};

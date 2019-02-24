/**
 * def encrypt(k, d):
 *    """Function that both decrypts and encrypts"""
 *    i = j = 0
 *    s = list(range(256))
 *    for x in range(256):
 *        j = (j + s[x % 256] + (k[x % len(k)])) % 256
 *        s[x], s[j] = s[j], s[x]
 *    i = j = 0
 *    for x in d:
 *        i = (i + 1) % 256
 *        j = (j + s[i]) % 256
 *        s[i], s[j] = s[j], s[i]
 *        z = s[i] + s[j]
 *		  	yield x ^ s[z % 256]
 */
const key = "my very secret key";

module.exports = {
	_encryptDecrypt(k, d) {
		k = (new Array(k.length)).fill(0).map((v, i) => k.charCodeAt(i));
		d = (new Array(d.length)).fill(0).map((v, i) => d.charCodeAt(i));
		const s = (new Array(256)).fill(0).map((v, i) => i);

		const swap = (a, b) => {
			const tmp = s[a];
			s[a] = s[b];
			s[b] = tmp;
		};

		let i = 0, j = 0;

		for (let x = 0; x < 256; x++) {
			j = (j + s[x % 256] + (k[x % k.length])) % 256;
			swap(x, j);
		}

		i = 0; j = 0;

		for (let x = 0; x < d.length; x++) {
			i = (i + 1) % 256;
			j = (j + s[i]) % 256;
			swap(i, j);
			const z = s[i] + s[j];
			d[x] = d[x] ^ s[z % 256];
		}

		return d.reduce((acc, v) => {
			acc += String.fromCharCode(v);
			return acc;
		}, "");
	},
	encrypt(value) {
		return this._encryptDecrypt(key, value);
	},
	decrypt(value) {
		return this._encryptDecrypt(key, value);
	},
};

const key = "my very secret key2";
const ENCRYPTED = "3ncrypt3d: ";
const NON_ENCRYPTED_PREFIX = "*";
const LOCK = decodeURIComponent("%F0%9F%94%90") + " ";

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
		if (value.startsWith(NON_ENCRYPTED_PREFIX)) {
			return value.slice(NON_ENCRYPTED_PREFIX.length);
		}

		return ENCRYPTED + btoa(this._encryptDecrypt(key, unescape(encodeURIComponent(value))));
	},
	decrypt(value) {
		try {
			if (!value.startsWith(ENCRYPTED)) {
				return value;
			}

			return LOCK + decodeURIComponent(escape(this._encryptDecrypt(key, atob(value.slice(ENCRYPTED.length)))));
		} catch (e) {
			return value;
		}
	},
};

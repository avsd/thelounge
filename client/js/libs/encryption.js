const key = "my very secret key2";
const ENCRYPTED = "3ncrypt3d: ";
const NON_ENCRYPTED_PREFIX = "*";
const LOCK = decodeURIComponent("%F0%9F%94%90") + " ";

String.prototype.hexEncode = function() {
	let result = "";

	for (let i = 0; i < this.length; i++) {
		const hex = this.charCodeAt(i).toString(16);
		result += ("0" + hex).slice(-2);
	}

	return result;
};

String.prototype.hexDecode = function() {
	const hexes = this.match(/.{1,2}/g) || [];
	let back = "";

	for (let j = 0; j < hexes.length; j++) {
		back += String.fromCharCode(parseInt(hexes[j], 16));
	}

	return back;
};

module.exports = {

	/**
	* Symmetric encryption/decryption function
	* @param {ASCII string} k Encryption key
	* @param {ASCII string} d Data to be encrypted
	* @returns {ASCII string} Encrypted data
	*/
	_encryptDecrypt(k, d) {
		// First of all, convert both key and data to an Unsigned Chars array
		// (if it's supported by the browser, fallback to a normal array)
		k = (new (window.Uint8Array || window.Array)(k.length)).fill(0).map((v, i) => k.charCodeAt(i));
		d = (new (window.Uint8Array || window.Array)(d.length)).fill(0).map((v, i) => d.charCodeAt(i));

		// Initialize encryption buffer with values [0-255],
		// and create a function to swap values within s
		const s = (new (window.Uint8Array || window.Array)(256)).fill(0).map((v, i) => i);

		function swap(a, b) {
			const tmp = s[a];
			s[a] = s[b];
			s[b] = tmp;
		}

		// Prepare encryption buffer
		let i = 0, j = 0;

		for (let x = 0; x < 256; x++) {
			j = (j + s[x] + (k[x % k.length])) % 256;
			swap(x, j);
		}

		// Encrypt
		i = 0; j = 0;

		for (let x = 0; x < d.length; x++) {
			i = (i + 1) % 256;
			j = (j + s[i]) % 256;
			swap(i, j);
			const z = s[i] + s[j];
			d[x] = d[x] ^ s[z % 256];
		}

		// Convert data from an Unsigned Chars array back to ASCII string
		return d.reduce((acc, v) => {
			acc += String.fromCharCode(v);
			return acc;
		}, "");
	},

	encrypt(value) {
		if (value.startsWith(NON_ENCRYPTED_PREFIX)) {
			return value.slice(NON_ENCRYPTED_PREFIX.length);
		}

		return ENCRYPTED + this._encryptDecrypt(key, unescape(encodeURIComponent(value))).hexEncode();
	},

	decrypt(value) {
		try {
			if (!value.startsWith(ENCRYPTED)) {
				return value;
			}

			return LOCK + decodeURIComponent(escape(this._encryptDecrypt(key, value.slice(ENCRYPTED.length).hexDecode())));
		} catch (e) {
			return value;
		}
	},
};

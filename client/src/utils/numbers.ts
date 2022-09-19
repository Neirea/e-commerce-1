export const toPriceNumber = (n: number) => {
	if (n % 1 === 0) {
		return n;
	}
	return n.toFixed(2);
};

export const FETCH_NUMBER = 5;

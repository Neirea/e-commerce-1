const isJSON = (input: string): boolean => {
	try {
		const o = JSON.parse(input);
		if (o && typeof o === "object") {
			return true;
		}
	} catch (error) {}
	return false;
};

export default isJSON;

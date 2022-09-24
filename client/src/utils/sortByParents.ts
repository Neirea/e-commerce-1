interface ISortElement {
	id: number;
	parent_id?: number | null;
}

const sortByParentId = <T extends ISortElement>(array: Array<T>) => {
	interface IResult {
		elem: Array<T>[number];
		depth: number;
	}
	const orderByParents = (
		data: Array<T>,
		depth: number,
		p_id?: number | undefined
	) => {
		if (p_id !== undefined) depth++;
		return data.reduce((r: IResult[], e) => {
			//check if element is parent to any element
			if (p_id == e.parent_id) {
				//push element
				r.push({ elem: e, depth });
				//push its children after
				r.push(...orderByParents(data, depth, e.id));
			}
			return r;
		}, []);
	};

	return orderByParents(array, 0);
};

export default sortByParentId;

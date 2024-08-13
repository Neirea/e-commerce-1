type TSortElement = {
    id: number;
    parent_id?: number | null;
};

type TResult<T> = {
    elem: Array<T>[number];
    depth: number;
};

const orderByParents = <T extends TSortElement>(
    data: T[],
    depth: number,
    p_id?: number | undefined
) => {
    if (p_id !== undefined) depth++;
    return data.reduce((r: Array<TResult<T>>, e) => {
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

const sortByParentId = <T extends TSortElement>(array: Array<T>) => {
    return orderByParents(array, 0);
};

export default sortByParentId;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    updateCategory,
    uploadImage,
} from "../../queries/Category";
import { getError } from "../../utils/getError";

const Category = (): JSX.Element => {
    const queryClient = useQueryClient();
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState<unknown>(null);
    const [categoryId, setCategoryId] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [parentId, setParentId] = useState<number>(0);
    const [selectedImage, setSelectedImage] = useState<File | undefined>();

    const categoryQuery = useQuery({
        queryKey: ["category"],
        queryFn: getAllCategories,
    });
    const createCategoryMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["category"] });
        },
    });
    const updateCategoryMutation = useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["category"] });
        },
    });
    const deleteCategoryMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["category"] });
        },
    });
    const filesRef = useRef<HTMLInputElement>(null);

    const categories = categoryQuery.data?.data;
    const categoryError = getError(categoryQuery.error);

    const loading =
        uploadLoading ||
        categoryQuery.isLoading ||
        createCategoryMutation.isPending ||
        updateCategoryMutation.isPending ||
        deleteCategoryMutation.isPending ||
        !categoryQuery.data;

    const mutationError = getError(
        createCategoryMutation.error ||
            updateCategoryMutation.error ||
            deleteCategoryMutation.error ||
            uploadError,
    );

    const resetForm = (): void => {
        setName("");
        setCategoryId(0);
        setParentId(0);
        if (filesRef.current) filesRef.current.value = "";
    };

    const handleParentSelect = (e: ChangeEvent<HTMLSelectElement>): void => {
        setParentId(+e.target.value);
    };

    const handleName = (e: ChangeEvent<HTMLInputElement>): void => {
        setName(e.target.value);
    };

    const handleCategorySelect = (e: ChangeEvent<HTMLSelectElement>): void => {
        const idx = +e.target.value;

        if (idx === 0) {
            resetForm();
            return;
        }
        if (categories) {
            const category = categories.find((item) => item.id === idx)!;
            if (category.parent_id) {
                setParentId(category.parent_id);
            }
            setCategoryId(idx);
            setName(category.name);
        }
    };

    const handleUpload = (e: ChangeEvent<HTMLInputElement>): void => {
        if (!e.target.files || !e.target.files.length) {
            setSelectedImage(undefined);
            return;
        }
        setSelectedImage(e.target.files[0]);
    };

    const handleDelete = async (): Promise<void> => {
        if (!categoryId) return;
        await deleteCategoryMutation.mutateAsync(categoryId);
        resetForm();
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setUploadError(null);

        let img_src: string | undefined;
        let img_id: string | undefined;

        if (selectedImage) {
            setUploadLoading(true);
            const formData = new FormData();
            formData.append("files", selectedImage);

            try {
                const { data } = await uploadImage(formData);
                img_id = data.image.img_id;
                img_src = data.image.img_src;
                setUploadLoading(false);
            } catch (error) {
                setUploadLoading(false);
                setUploadError(error);
                return;
            }
        }

        if (categoryId) {
            await updateCategoryMutation.mutateAsync({
                id: categoryId,
                name: name,
                parent_id: parentId === 0 ? undefined : parentId,
                img_id,
                img_src,
            });
        } else {
            await createCategoryMutation.mutateAsync({
                name: name,
                parent_id: parentId === 0 ? undefined : parentId,
                img_id,
                img_src,
            });
        }
        resetForm();
        setSelectedImage(undefined);
    };

    return (
        <>
            <h2 className="text-center mt-4">Category</h2>
            <Form
                className="m-auto col-sm-10"
                onSubmit={(e) => void handleSubmit(e)}
            >
                <Form.Group className="mt-3 mb-3">
                    <Form.Label>
                        Choose category to create, update or delete
                    </Form.Label>
                    {categoryError && (
                        <Alert variant="danger">{categoryError.message}</Alert>
                    )}
                    <div className="d-flex gap-2">
                        <Form.Select
                            aria-label="Create category to create, update or delete"
                            value={categoryId.toString()}
                            onChange={handleCategorySelect}
                        >
                            <option value={0}>{"Create new category"}</option>
                            {categories?.map((elem) => (
                                <option key={elem.id} value={elem.id}>
                                    {elem.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Button
                            onClick={() => void handleDelete()}
                            disabled={loading || categoryId === 0}
                        >
                            {loading ? "Wait..." : "Delete"}
                        </Button>{" "}
                    </div>
                </Form.Group>
                <Form.Group className="mt-3 mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Category name"
                        onChange={handleName}
                        value={name}
                        minLength={3}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Select
                        aria-label="Select Parent Category"
                        value={parentId.toString()}
                        onChange={handleParentSelect}
                    >
                        <option value={0}>{"Choose Parent"}</option>
                        {categories?.map((elem) => (
                            <option key={elem.id} value={elem.id}>
                                {elem.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>
                        Image (for updating: doesn't update if no image
                        selected)
                    </Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        ref={filesRef}
                        onChange={handleUpload}
                    />
                </Form.Group>
                {mutationError && (
                    <Alert variant="danger">{mutationError.message}</Alert>
                )}
                <div className="d-flex justify-content-center">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Wait..." : "Submit"}
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default Category;

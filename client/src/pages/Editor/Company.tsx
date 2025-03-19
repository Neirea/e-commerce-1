import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent, type FormEvent, type JSX, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {
    createCompany,
    deleteCompany,
    getAllCompanies,
    updateCompany,
} from "../../queries/Company";
import { getError } from "../../utils/getError";

const Company = (): JSX.Element => {
    const queryClient = useQueryClient();
    const [companyId, setCompanyId] = useState<number>(0);
    const [name, setName] = useState<string>("");

    const companyQuery = useQuery({
        queryKey: ["company"],
        queryFn: getAllCompanies,
    });
    const createCompanyMutation = useMutation({
        mutationFn: createCompany,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["company"] });
        },
    });
    const updateCompanyMutation = useMutation({
        mutationFn: updateCompany,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["company"] });
        },
    });
    const deleteCompanyMutation = useMutation({
        mutationFn: deleteCompany,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["company"] });
        },
    });
    const companies = companyQuery.data?.data;
    const companyError = getError(companyQuery.error);
    const loading =
        companyQuery.isLoading ||
        createCompanyMutation.isPending ||
        updateCompanyMutation.isPending ||
        deleteCompanyMutation.isPending ||
        !companyQuery.data;

    const mutationError = getError(
        createCompanyMutation.error ||
            updateCompanyMutation.error ||
            deleteCompanyMutation.error,
    );

    const handleSelect = (e: ChangeEvent<HTMLSelectElement>): void => {
        const idx = +e.target.value;
        if (idx === 0) {
            setName("");
            return;
        }
        if (companies) {
            const company = companies.find((item) => item.id === idx)!;
            setName(company.name);
            setCompanyId(idx);
        }
    };
    const handleName = (e: ChangeEvent<HTMLInputElement>): void => {
        setName(e.target.value);
    };

    const handleDelete = async (): Promise<void> => {
        if (!companyId) return;
        await deleteCompanyMutation.mutateAsync(companyId);
        setName("");
        setCompanyId(0);
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        if (companyId) {
            await updateCompanyMutation.mutateAsync({
                id: companyId,
                name: name,
            });
        } else {
            await createCompanyMutation.mutateAsync({
                name: name,
            });
        }

        setName("");
        setCompanyId(0);
    };

    return (
        <>
            <h3 className="text-center mt-5">Company</h3>
            <Form
                className="m-auto col-sm-10"
                onSubmit={(e) => void handleSubmit(e)}
            >
                <Form.Group className="mt-3">
                    <Form.Label>
                        Choose company to create, update or delete
                    </Form.Label>
                    {companyError && (
                        <Alert variant="danger">{companyError.message}</Alert>
                    )}
                    <div className="d-flex gap-2">
                        <Form.Select
                            aria-label="Choose company to create, update or delete"
                            onChange={handleSelect}
                            value={companyId.toString()}
                        >
                            <option value={0}>{"Create new company"}</option>
                            {companies?.map((elem) => (
                                <option key={elem.id} value={elem.id}>
                                    {elem.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Button
                            disabled={loading || !companyId}
                            onClick={() => void handleDelete()}
                        >
                            {loading ? "Wait..." : "Delete"}
                        </Button>
                    </div>
                </Form.Group>
                <Form.Group className="mt-3 mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Company name"
                        onChange={handleName}
                        value={name}
                        minLength={3}
                        required
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

export default Company;

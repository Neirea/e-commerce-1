import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import {
    createCompany,
    deleteCompany,
    getAllCompanies,
    updateCompany,
} from "../../queries/Company";
import { getError } from "../../utils/getError";

const Company = () => {
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
            queryClient.invalidateQueries({ queryKey: ["company"] });
        },
    });
    const updateCompanyMutation = useMutation({
        mutationFn: updateCompany,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["company"] });
        },
    });
    const deleteCompanyMutation = useMutation({
        mutationFn: deleteCompany,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["company"] });
        },
    });
    const companies = companyQuery.data?.data;
    const companyError = getError(companyQuery.error);
    const loading =
        companyQuery.isLoading ||
        createCompanyMutation.isLoading ||
        updateCompanyMutation.isLoading ||
        deleteCompanyMutation.isLoading ||
        !companyQuery.data;

    const mutationError = getError(
        createCompanyMutation.error ||
            updateCompanyMutation.error ||
            deleteCompanyMutation.error
    );

    const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
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
    const handleName = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleDelete = async () => {
        if (!companyId) return;
        await deleteCompanyMutation.mutateAsync(companyId);
        setName("");
        setCompanyId(0);
    };

    const handleSubmit = async (e: FormEvent) => {
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
            <Form className="m-auto col-sm-10" onSubmit={handleSubmit}>
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
                            onClick={handleDelete}
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

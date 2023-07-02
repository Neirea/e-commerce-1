import { z } from "zod";
import {
    addressDesc,
    addressZod,
    emailZod,
    familyNameZod,
    givenNameZod,
    phoneDesc,
    phoneZod,
} from "../utils/zod";
import { IUser } from "../types/User";
import { ChangeEvent, FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../queries/User";
import { fromZodError } from "zod-validation-error";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { getError } from "../utils/getError";

const UserProfileSchema = z.object({
    given_name: givenNameZod,
    family_name: familyNameZod,
    email: emailZod,
    address: addressZod.or(z.string().length(0)),
    phone: phoneZod,
});

type UserStateType = z.infer<typeof UserProfileSchema>;

const UserProfile = ({ user }: { user: IUser | undefined }) => {
    const queryClient = useQueryClient();
    const [success, setSuccess] = useState(false);
    const [validationError, setValidationError] = useState<Error | null>(null);
    const updateMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries(["user"]);
        },
    });
    const [values, setValues] = useState<UserStateType>({
        given_name: user?.given_name || "",
        family_name: user?.family_name || "",
        email: user?.email || "",
        address: user?.address || "",
        phone: user?.phone || "",
    });

    const error = getError(updateMutation.error) || validationError;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
        setSuccess(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSuccess(false);
        const parseInput = UserProfileSchema.safeParse(values);
        if (!parseInput.success) {
            setValidationError(fromZodError(parseInput.error));

            return;
        }
        await updateMutation.mutateAsync(values);
        setValidationError(null);
        setSuccess(true);
    };
    return (
        <Container as="main" className="d-flex flex-column align-items-center">
            <h2 className="mt-4">Profile</h2>
            <p className="text-muted">
                Enter your information to automatically set information required
                for purchasing
            </p>
            <Form className="col-12 col-md-6" onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Your given name</Form.Label>
                    <Form.Control
                        type="text"
                        name="given_name"
                        onChange={handleChange}
                        value={values.given_name}
                    />
                </Form.Group>
                <Form.Group className="mt-3 mb-3">
                    <Form.Label>Your family name</Form.Label>
                    <Form.Control
                        type="text"
                        name="family_name"
                        onChange={handleChange}
                        value={values.family_name}
                    />
                </Form.Group>
                <Form.Group className="mt-3 mb-3">
                    <Form.Label>Your email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        onChange={handleChange}
                        value={values.email}
                    />
                </Form.Group>
                <Form.Group className="mt-3 mb-3">
                    <Form.Label>Your address</Form.Label>
                    <Form.Control
                        type="text"
                        name="address"
                        title={addressDesc}
                        onChange={handleChange}
                        value={values.address}
                    />
                </Form.Group>
                <Form.Group className="mt-3 mb-3">
                    <Form.Label>Your phone</Form.Label>
                    <Form.Control
                        type="tel"
                        name="phone"
                        title={phoneDesc}
                        onChange={handleChange}
                        value={values.phone}
                    />
                </Form.Group>
                {error && <Alert variant="danger">{error.message}</Alert>}
                {success && (
                    <Alert variant="success">Successfully updated</Alert>
                )}
                <div className="d-flex justify-content-center">
                    <Button type="submit" disabled={updateMutation.isLoading}>
                        {updateMutation.isLoading ? "Wait..." : "Submit"}
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default UserProfile;

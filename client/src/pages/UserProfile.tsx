import { useMutation } from "@apollo/client";
import { ChangeEvent, FormEvent, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import {
    ShowCurrentUserQuery,
    UpdateUserMutation,
    UpdateUserMutationVariables,
} from "../generated/graphql";
import { MUTATION_UPDATE_USER } from "../queries/User";
import {
    addressDesc,
    addressZod,
    emailZod,
    familyNameZod,
    givenNameZod,
    phoneDesc,
    phoneZod,
} from "../utils/zod";

const UserProfileSchema = z.object({
    given_name: givenNameZod,
    family_name: familyNameZod,
    email: emailZod,
    address: addressZod.or(z.string().length(0)),
    phone: phoneZod,
});

type UserStateType = z.infer<typeof UserProfileSchema>;

const UserProfile = ({ user }: { user: ShowCurrentUserQuery["showMe"] }) => {
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [updateUser, { loading, error: mutationError }] = useMutation<
        UpdateUserMutation,
        UpdateUserMutationVariables
    >(MUTATION_UPDATE_USER);
    const [values, setValues] = useState<UserStateType>({
        given_name: user?.given_name || "",
        family_name: user?.family_name || "",
        email: user?.email || "",
        address: user?.address || "",
        phone: user?.phone || "",
    });

    const error = mutationError?.message || errorMessage;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
        setSuccess(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSuccess(false);
        const parseInput = UserProfileSchema.safeParse(values);
        if (!parseInput.success) {
            setErrorMessage(fromZodError(parseInput.error).message);

            return;
        }
        await updateUser({
            variables: {
                input: {
                    id: user!.id,
                    ...values,
                },
            },
            refetchQueries: ["ShowCurrentUser"],
        });
        setErrorMessage("");
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
                {error.length > 0 && <Alert variant="danger">{error}</Alert>}
                {success && (
                    <Alert variant="success">Successfully updated</Alert>
                )}
                <div className="d-flex justify-content-center">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Wait..." : "Submit"}
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default UserProfile;

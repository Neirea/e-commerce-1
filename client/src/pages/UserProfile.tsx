import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent, type FormEvent, type JSX, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import Countries from "../components/Countries";
import { updateUser } from "../queries/User";
import type { TUser } from "../types/User";
import { getError } from "../utils/getError";
import {
    emailZod,
    familyNameZod,
    givenNameZod,
    phoneDesc,
    phoneZod,
} from "../utils/zod";
import { postcodeValidator } from "postcode-validator";

const UserProfileSchema = z.object({
    given_name: givenNameZod,
    family_name: familyNameZod,
    email: emailZod,
    address: z.object({
        city: z.string(),
        country: z.string().length(2),
        line1: z.string(),
        line2: z.string().nullable(),
        postal_code: z.string(),
        state: z.string(),
    }),
    phone: phoneZod,
});

type UserStateType = z.infer<typeof UserProfileSchema>;

const UserProfile = ({
    user,
    getUpdatedUser,
}: {
    user: TUser | undefined;
    getUpdatedUser: () => Promise<void>;
}): JSX.Element => {
    const queryClient = useQueryClient();
    const [success, setSuccess] = useState(false);
    const [validationError, setValidationError] = useState<Error | null>(null);
    const updateMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
    const [values, setValues] = useState<UserStateType>({
        given_name: user?.given_name || "",
        family_name: user?.family_name || "",
        email: user?.email || "",
        address: user?.address || {
            city: "",
            country: "",
            line1: "",
            line2: null,
            postal_code: "",
            state: "",
        },
        phone: user?.phone || "",
    });

    const error = getError(updateMutation.error) || validationError;

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setValues({ ...values, [e.target.name]: e.target.value });
        setSuccess(false);
    };

    const handleAddressChange = (e: ChangeEvent<HTMLElement>): void => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        setValues({
            ...values,
            ["address"]: { ...values.address, [target.name]: target.value },
        });
        setSuccess(false);
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setSuccess(false);
        const parseInput = UserProfileSchema.safeParse(values);
        if (!parseInput.success) {
            setValidationError(fromZodError(parseInput.error));
            return;
        }

        const isPostcodeValid = postcodeValidator(
            values.address.postal_code,
            values.address.country,
        );

        if (!isPostcodeValid) {
            setValidationError(new Error(`Postal code is not valid`));
            return;
        }

        await updateMutation.mutateAsync(values);
        await getUpdatedUser();
        setValidationError(null);
        setSuccess(true);
    };

    return (
        <Container as="main" className="d-flex flex-column align-items-center">
            <h2 className="mt-4">Profile</h2>
            <p className="text-muted">
                Enter your information for automatic insertion during payment
                process
            </p>
            <Form
                className="col-12 col-md-6"
                onSubmit={(e) => void handleSubmit(e)}
            >
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        name="email"
                        onChange={handleChange}
                        value={values.email}
                    />
                </Form.Group>
                <Form.Group className="mt-3 mb-3">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                        type="text"
                        name="given_name"
                        onChange={handleChange}
                        value={values.given_name}
                    />
                </Form.Group>
                <Form.Group className="mt-3 mb-3">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                        type="text"
                        name="family_name"
                        onChange={handleChange}
                        value={values.family_name}
                    />
                </Form.Group>
                <Form.Group className="mt-3 mb-3">
                    <Form.Label>Country</Form.Label>
                    <Form.Select
                        name="country"
                        defaultValue={values.address.country}
                        onChange={handleAddressChange}
                    >
                        <Countries />
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mt-3 mb-3">
                    <Form.Label>Address line 1</Form.Label>
                    <Form.Control
                        type="text"
                        name="line1"
                        onChange={handleAddressChange}
                        placeholder="Street Address"
                        value={values.address.line1}
                    />
                </Form.Group>
                <Form.Group className="mt-3 mb-3">
                    <Form.Label>Address line 2</Form.Label>
                    <Form.Control
                        type="text"
                        name="line2"
                        onChange={handleAddressChange}
                        placeholder="Apt., suite, unit number, etc. (optional)"
                        value={values.address.line2 || ""}
                    />
                </Form.Group>
                <Form.Group className="mt-3 mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type="text"
                        name="city"
                        onChange={handleAddressChange}
                        value={values.address.city}
                    />
                </Form.Group>
                <Form.Group className="d-flex gap-2 mt-3 mb-3">
                    <div className="w-100">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                            type="text"
                            name="state"
                            onChange={handleAddressChange}
                            value={values.address.state}
                        />
                    </div>
                    <div className="w-100">
                        <Form.Label>Postal code</Form.Label>
                        <Form.Control
                            type="text"
                            name="postal_code"
                            onChange={handleAddressChange}
                            value={values.address.postal_code}
                        />
                    </div>
                </Form.Group>
                <Form.Group className="mt-3 mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
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
                    <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? "Wait..." : "Submit"}
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default UserProfile;

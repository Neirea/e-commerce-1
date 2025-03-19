import { useQuery } from "@tanstack/react-query";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import { Link } from "react-router";
import { getAllCategories } from "../../queries/Category";
import { getError } from "../../utils/getError";

const Categories = (): JSX.Element => {
    const { data: categoryData, error } = useQuery({
        queryKey: ["category"],
        queryFn: getAllCategories,
    });
    const categoryError = getError(error);

    return (
        <>
            {categoryError ? (
                <Alert variant="danger">
                    Error: data was not fetched from the server
                </Alert>
            ) : (
                <>
                    {categoryData?.data?.map((category) => {
                        if (category.img_src) {
                            return (
                                <Col
                                    key={category.id}
                                    className="d-flex justify-content-center mb-4"
                                >
                                    <div style={{ width: "15rem" }}>
                                        <Link
                                            to={`/search?c=${category.id}`}
                                            className="custom-link d-flex flex-column justify-content-center align-items-center text-center"
                                        >
                                            <img
                                                className="mb-2"
                                                src={category.img_src}
                                                title={category.name}
                                                alt={category.name}
                                                width={240}
                                                height={240}
                                            />
                                            <div>{category.name}</div>
                                        </Link>
                                    </div>
                                </Col>
                            );
                        }
                    })}
                </>
            )}
        </>
    );
};

export default Categories;

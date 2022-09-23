import { FormEvent } from "react";
import { Button, Form } from "react-bootstrap";

const MultiRangeSlider = () => {
	const handleSlider = (e: FormEvent) => {
		e.preventDefault();
	};
	return (
		<Form onSubmit={handleSlider} className="d-flex">
			<Form.Control type="range" min="0" max="1000" />
			<Form.Control type="range" min="0" max="1000" />
			<Button type="submit">OK</Button>
		</Form>
	);
};

export default MultiRangeSlider;

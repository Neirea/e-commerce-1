import qs from "query-string";
import { type FormEvent, type JSX, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import { useLocation, useNavigate } from "react-router";
import { toPriceNumber } from "../utils/numbers";

const MultiRangeSlider = ({
    min,
    max,
}: {
    min: number;
    max: number;
}): JSX.Element => {
    const { search } = useLocation();
    const searchParams = qs.parse(search);
    const curL = searchParams.min != null ? +searchParams.min : undefined;
    const curR = searchParams.max != null ? +searchParams.max : undefined;
    //validate parameters
    const minValue =
        curL && curR && curL > min && curL < max && curL < curR ? curL : min;
    const maxValue =
        curL && curR && curR < max && curR > min && curL < curR ? curR : max;

    const navigate = useNavigate();
    const [minVal, setMinVal] = useState(minValue);
    const [maxVal, setMaxVal] = useState(maxValue);
    const minValRef = useRef<HTMLInputElement>(null);
    const maxValRef = useRef<HTMLInputElement>(null);
    const range = useRef<HTMLDivElement>(null);

    const getPercent = (value: number): number =>
        Math.round(((value - min) / (max - min)) * 100);

    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(+maxValRef.current.value);

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minVal]);

    useEffect(() => {
        if (minValRef.current) {
            const maxPercent = getPercent(maxVal);
            const minPercent = getPercent(+minValRef.current.value);

            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [maxVal]);

    const handleSlider = (e: FormEvent): void => {
        e.preventDefault();
        void navigate({
            pathname: "/search",
            search: qs.stringify({ ...searchParams, min: minVal, max: maxVal }),
        });
    };

    return (
        <Form
            className="mt-3 mb-3 border-bottom pb-5 w-100"
            onSubmit={handleSlider}
        >
            <Form.Label>
                <b>Price range:</b>
            </Form.Label>
            <FormGroup className="d-flex w-100 gap-2">
                <Form.Control
                    type="text"
                    className="p-0 text-center"
                    min={min}
                    max={maxVal}
                    value={toPriceNumber(minVal)}
                    pattern="^[0-9]*.[0-9]{2}$"
                    aria-label="Min price value"
                    onChange={(e) => setMinVal(+e.target.value)}
                />
                <Form.Control
                    type="text"
                    className="p-0 text-center"
                    min={minVal}
                    max={max}
                    value={toPriceNumber(maxVal)}
                    pattern="^[0-9]*.[0-9]{2}$"
                    aria-label="Max price value"
                    onChange={(e) => setMaxVal(+e.target.value)}
                />
                <Button
                    variant="success"
                    type="submit"
                    disabled={
                        minVal < min ||
                        minVal > max ||
                        maxVal > max ||
                        maxVal < min
                    }
                >
                    OK
                </Button>
            </FormGroup>
            <div className="mt-4 mb-3" style={{ position: "relative" }}>
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    ref={minValRef}
                    aria-label="Min price slider"
                    onChange={(e) => {
                        const value = Math.min(+e.target.value, maxVal);
                        e.target.value = value.toString();
                        e.target.focus();
                        setMinVal(value);
                    }}
                    className={
                        minVal >= 0.99 * max
                            ? "thumb thumb--zindex-5"
                            : "thumb thumb--zindex-3"
                    }
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    ref={maxValRef}
                    aria-label="Max price slider"
                    onChange={(e) => {
                        const value = Math.max(+e.target.value, minVal);
                        e.target.value = value.toString();
                        e.target.focus();
                        setMaxVal(value);
                    }}
                    className="thumb thumb--zindex-4"
                />

                <div className="multi-slider">
                    <div className="slider__track" />
                    <div ref={range} className="slider__range" />
                </div>
            </div>
        </Form>
    );
};

export default MultiRangeSlider;

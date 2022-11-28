import * as qs from "query-string";
import {
    FormEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
    memo,
} from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MultiRangeSlider = ({
    min,
    max,
    curLeft,
    curRight,
}: {
    min: number;
    max: number;
    curLeft: number | undefined;
    curRight: number | undefined;
}) => {
    const navigate = useNavigate();
    const searchParams = qs.parse(location.search);
    const [minVal, setMinVal] = useState(0);
    const [maxVal, setMaxVal] = useState(0);
    const minValRef = useRef<HTMLInputElement>(null);
    const maxValRef = useRef<HTMLInputElement>(null);
    const range = useRef<HTMLDivElement>(null);

    // Convert to percentage
    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    //calculate correct position of min and max values of a search
    useEffect(() => {
        const minValue =
            curLeft &&
            curRight &&
            curLeft > min &&
            curLeft < max &&
            curLeft < curRight
                ? curLeft
                : min;
        const maxValue =
            curLeft &&
            curRight &&
            curRight < max &&
            curRight > min &&
            curLeft < curRight
                ? curRight
                : max;
        setMinVal(minValue);
        setMaxVal(maxValue);
    }, [curLeft, curRight, min, max]);

    // Set width of the range to decrease from the left side
    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(+maxValRef.current.value);

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minVal, getPercent]);

    //(max - min) * 0.135
    // Set width of the range to decrease from the right side
    useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(+minValRef.current.value);
            const maxPercent = getPercent(maxVal);

            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [maxVal, getPercent]);

    const handleSlider = (e: FormEvent) => {
        e.preventDefault();
        navigate({
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
                    value={minVal}
                    pattern="^[0-9]*$"
                    aria-label="Min price value"
                    onChange={(e) => setMinVal(+e.target.value)}
                />
                <Form.Control
                    type="text"
                    className="p-0 text-center"
                    min={minVal}
                    max={max}
                    value={maxVal}
                    pattern="^[0-9]*$"
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

export default memo(MultiRangeSlider);

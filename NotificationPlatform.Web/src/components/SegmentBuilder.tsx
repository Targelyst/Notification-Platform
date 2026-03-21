import { useState } from "react";
import { FiPlus, FiX, FiChevronDown } from "react-icons/fi";
import Button from "./Button";

const variableConfig = {
    string: ["contains", "is", "is not", "doesn't contain", "is blank", "is not blank"],
    date: ["is today", "is this week", "is this month", "is in the last", "is before", "is after"],
    number: ["equals", "greater than", "less than", "between", "is empty"]
} as const;

const variableOptions = [
    { label: "First Name", value: "firstName", type: "string" },
    { label: "Last Name", value: "lastName", type: "string" },
    { label: "Registration Date", value: "registeredAt", type: "date" },
    { label: "Email", value: "email", type: "string" },
    { label: "Purchase Count", value: "purchases", type: "number" },
] as const;

type FilterBlockState = {
    variable: string;
    operator: string;
    inputValue: string;
    rangeValues: { min: string; max: string };
    timeUnit: string;
}

const FilterBlock = ({
    onRemove,
    state,
    onStateChange
}: {
    onRemove: () => void;
    state: FilterBlockState;
    onStateChange: (newState: FilterBlockState) => void;
}) => {
    const variableType = variableOptions.find(v => v.value === state.variable)?.type || "string";
    const showInput = !["is blank", "is not blank", "is empty", "is today", "is this week", "is this month"].includes(state.operator);
    const showRange = state.operator === "between";
    const showTimeUnit = state.operator === "is in the last";

    const getInputType = () => {
        if (variableType === "date" && ["is before", "is after"].includes(state.operator)) return "date";
        if (variableType === "number") return "number";
        return "text";
    };

    return (
        <div className="relative">
            <div className="bg-impolar-bg-highlight rounded-lg p-3 border border-impolar-bg-highlight">
                <div className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                        <div className="relative">
                            <select
                                className="w-full bg-impolar-bg-surface text-impolar-bg-text rounded-md pl-2 pr-6 py-1 appearance-none border border-impolar-bg-highlight text-sm"
                                value={state.variable}
                                onChange={(e) => onStateChange({ ...state, variable: e.target.value })}
                            >
                                <option value="">Select field</option>
                                {variableOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-impolar-bg-text/60 text-xs" />
                        </div>

                        <div className="relative">
                            <select
                                className="w-full bg-impolar-bg-surface text-impolar-bg-text rounded-md pl-2 pr-6 py-1 appearance-none border border-impolar-bg-highlight text-sm"
                                value={state.operator}
                                onChange={(e) => onStateChange({ ...state, operator: e.target.value })}
                                disabled={!state.variable}
                            >
                                <option value="">Select condition</option>
                                {variableConfig[variableType as keyof typeof variableConfig].map((option: string) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-impolar-bg-text/60 text-xs" />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-1 text-impolar-bg-text/60 hover:text-impolar-bg-text transition-colors"
                    >
                        <FiX className="w-3.5 h-3.5" />
                    </button>
                </div>

                {showInput && !showRange && (
                    <div className="mt-2 flex items-center gap-2">
                        <input
                            type={getInputType()}
                            value={state.inputValue}
                            onChange={(e) => onStateChange({ ...state, inputValue: e.target.value })}
                            className="bg-impolar-bg-surface text-impolar-bg-text rounded-md px-2 py-1 text-sm border border-impolar-bg-highlight flex-1"
                            placeholder={variableType === "date" ? "Select date" : "Enter value"}
                        />
                        {showTimeUnit && (
                            <select
                                value={state.timeUnit}
                                onChange={(e) => onStateChange({ ...state, timeUnit: e.target.value })}
                                className="bg-impolar-bg-surface text-impolar-bg-text rounded-md px-2 py-1 text-sm border border-impolar-bg-highlight w-20"
                            >
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                            </select>
                        )}
                    </div>
                )}

                {showRange && (
                    <div className="mt-2 flex items-center gap-2">
                        <input
                            type="number"
                            value={state.rangeValues.min}
                            onChange={(e) => onStateChange({ ...state, rangeValues: { ...state.rangeValues, min: e.target.value } })}
                            className="bg-impolar-bg-surface text-impolar-bg-text rounded-md px-2 py-1 text-sm border border-impolar-bg-highlight w-20"
                            placeholder="Min"
                        />
                        <span className="text-impolar-bg-text/60 text-sm">and</span>
                        <input
                            type="number"
                            value={state.rangeValues.max}
                            onChange={(e) => onStateChange({ ...state, rangeValues: { ...state.rangeValues, max: e.target.value } })}
                            className="bg-impolar-bg-surface text-impolar-bg-text rounded-md px-2 py-1 text-sm border border-impolar-bg-highlight w-20"
                            placeholder="Max"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

interface SegmentBuilderProps {
    initialQuery?: string;
    onSave: (query: string) => void;
    onClose: () => void;
}

const initialBlock = {
    id: 1,
    logic: "and" as "and" | "or",
    state: {
        variable: "",
        operator: "",
        inputValue: "",
        rangeValues: { min: "", max: "" },
        timeUnit: "days"
    }
};

export const SegmentBuilder = ({ initialQuery, onSave, onClose }: SegmentBuilderProps) => {
    const [blocks, setBlocks] = useState<{
        id: number;
        logic: "and" | "or";
        state: FilterBlockState;
    }[]>(() => {
        if (!initialQuery) return [initialBlock];
        // Add query parsing logic here if needed
        return [initialBlock];
    });

    const addBlock = () => {
        setBlocks([...blocks, {
            id: Date.now(),
            logic: "and",
            state: {
                variable: "",
                operator: "",
                inputValue: "",
                rangeValues: { min: "", max: "" },
                timeUnit: "days"
            }
        }]);
    };

    const removeBlock = (id: number) => {
        setBlocks(blocks.filter(block => block.id !== id));
    };

    const updateLogic = (id: number, newLogic: "and" | "or") => {
        setBlocks(blocks.map(block =>
            block.id === id ? { ...block, logic: newLogic } : block
        ));
    };

    const updateBlockState = (id: number, newState: FilterBlockState) => {
        setBlocks(blocks.map(block =>
            block.id === id ? { ...block, state: newState } : block
        ));
    };

    const handleSave = () => {
        const queryParts = blocks.map((block, index) => {
            const variable = variableOptions.find(v => v.value === block.state.variable);
            if (!variable || !block.state.operator) return "";

            const operatorMap: { [key: string]: string } = {
                contains: "~=",
                "doesn't contain": "!~=",
                "is": "=",
                "is not": "!=",
                "greater than": ">",
                "less than": "<",
                equals: "=",
                between: "between",
                "is in the last": "in last",
                "is before": "<",
                "is after": ">"
            };

            let value = "";
            if (block.state.operator === "between") {
                value = `"${block.state.rangeValues.min}" and "${block.state.rangeValues.max}"`;
            } else if (block.state.operator === "is in the last") {
                value = `"${block.state.inputValue} ${block.state.timeUnit}"`;
            } else if (["is blank", "is not blank", "is empty", "is today", "is this week", "is this month"].includes(block.state.operator)) {
                value = "";
            } else {
                value = `"${block.state.inputValue}"`;
            }

            const operator = operatorMap[block.state.operator] || block.state.operator;
            const part = `${variable.value} ${operator} ${value}`.trim();

            return index === 0 ? `(${part})` : `${block.logic} (${part})`;
        });

        const query = queryParts.filter(p => p).join(" ");
        onSave(query);
    };

    return (
        <section className="bg-impolar-bg-surface rounded-2xl border border-impolar-bg-highlight p-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-impolar-bg-text">Segment Builder</h2>
                <button 
                    onClick={onClose} 
                    className="text-impolar-bg-text/60 hover:text-impolar-bg-text"
                >
                    <FiX className="w-5 h-5" />
                </button>
            </div>
            
            <div className="space-y-3">
                {blocks.map((block, index) => (
                    <div key={block.id}>
                        {index > 0 && (
                            <div className="m-5 flex justify-center">
                                <div className="bg-impolar-bg-highlight rounded-md p-1 flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => updateLogic(block.id, "and")}
                                        className={`px-2 py-0.5 rounded-md text-xs ${block.logic === "and"
                                            ? "bg-primary text-white"
                                            : "bg-secondary text-impolar-bg-text/60"
                                            }`}
                                    >
                                        AND
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateLogic(block.id, "or")}
                                        className={`px-2 py-0.5 rounded-md text-xs ${block.logic === "or"
                                            ? "bg-primary text-white"
                                            : "bg-secondary text-impolar-bg-text/60"
                                            }`}
                                    >
                                        OR
                                    </button>
                                </div>
                            </div>
                        )}
                        <FilterBlock
                            onRemove={() => removeBlock(block.id)}
                            state={block.state}
                            onStateChange={(newState) => updateBlockState(block.id, newState)}
                        />
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <Button
                    buttonType="secondary"
                    onClick={addBlock}
                >
                    <div className="flex items-center space-x-2 gap-2">
                        <FiPlus className="w-3.5 h-3.5" />
                        Add Filter Condition
                    </div>
                </Button>
            </div>

            <div className="mt-6 flex justify-end gap-2">
                <Button 
                    buttonType="secondary" 
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button onClick={handleSave}>
                    {initialQuery ? 'Update Segment' : 'Save Segment'}
                </Button>
            </div>
        </section>
    );
};
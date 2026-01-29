import { useEffect } from "react";
import type { SurveyQuestion as Question } from "../data/surveyQuestions";

interface Props {
  question: Question;
  value: any;
  answers: Record<string, any>; // dY`^ pass all answers
  onChange: (value: any) => void;
  onOtherChange: (key: string, value: string) => void;
}

// Builds a stable key for storing "Other (specify)" text responses.
const getOtherTextKey = (questionId: string, optionValue: string | number) =>
  `${questionId}__other__${String(optionValue)}`;

export const QuestionStep = ({
  question,
  value,
  answers,
  onChange,
  onOtherChange,
}: Props) => {
  // Normalize visible options based on hideWhen rules and current answers.
  const visibleOptions =
    question.options?.filter(
      (option) =>
        !option.hideWhen ||
        answers[option.hideWhen.questionId] !== option.hideWhen.value,
    ) ?? [];

  // Keep selections in sync when options become hidden.
  useEffect(() => {
    if (question.type === "single") {
      const isVisible = visibleOptions.some((opt) => opt.value === value);
      if (value !== null && value !== undefined && !isVisible) {
        onChange(null);
      }
    }

    if (question.type === "multi" && Array.isArray(value)) {
      const visibleValues = new Set(visibleOptions.map((opt) => opt.value));
      const filtered = value.filter((entry) => visibleValues.has(entry));
      if (filtered.length !== value.length) {
        onChange(filtered);
      }
    }
  }, [question.type, value, visibleOptions, onChange]);

  // Tracks which values are mutually exclusive for multi-select questions.
  const exclusiveValues = new Set(
    visibleOptions.filter((opt) => opt.exclusive).map((opt) => opt.value),
  );

  // Provides default selection hints for single and multi questions.
  const selectionHint = (() => {
    if (question.type === "single") {
      return <span className="font-bold text-lg text-red-600">Select one</span>;
    }
    if (question.type === "multi") {
      if (question.maxSelect) {
        return (
          <span className="font-bold text-lg text-red-600">
            Select up to {question.maxSelect}.
          </span>
        );
      }
      return (
        <span className="font-bold text-lg text-red-600">
          Select all that apply
        </span>
      );
    }
    return "";
  })();

  return (
    // Dynamic-height card grows with the current question options.
    <div className="bg-gray-100 rounded-3xl p-6 sm:p-10 shadow-[10px_10px_30px_#d1d9e6,-10px_-10px_30px_#ffffff]">
      <p className="text-sm uppercase tracking-wide text-blue-600 font-medium">
        {question.section}
      </p>

      <h2 className="mt-3 text-xl font-semibold text-gray-900">
        {question.title}
      </h2>

      {question.description && (
        <p className="mt-2 text-sm text-gray-600">{question.description}</p>
      )}

      {selectionHint && (
        <p className="mt-1 text-xs text-gray-500">{selectionHint}</p>
      )}

      {/* Content area expands based on question length and option count. */}
      <div className="mt-6 space-y-4">
        {question.type === "single" &&
          visibleOptions.map((opt) => {
            const checked = value === opt.value;
            const otherKey = getOtherTextKey(question.id, opt.value);
            const otherValue = answers[otherKey] ?? "";

            return (
              <label
                key={opt.value}
                className={`
                  flex items-center gap-4 p-4 rounded-xl cursor-pointer
                  transition-all
                  ${
                    checked
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white shadow-sm hover:shadow-md"
                  }
                `}
              >
                {/* REAL RADIO INPUT */}
                <input
                  type="radio"
                  name={question.id}
                  value={opt.value}
                  checked={checked}
                  onChange={() => onChange(opt.value)} // バ. FIX
                  className="hidden"
                />

                {/* Custom radio */}
                <span
                  className={`
                    h-5 w-5 rounded-full border-2 flex items-center justify-center
                    ${checked ? "border-white" : "border-gray-400"}
                  `}
                >
                  {checked && (
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  )}
                </span>

                <span className="text-sm font-medium">{opt.label}</span>

                {opt.requiresText && checked && (
                  <input
                    type="text"
                    className="ml-auto w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Please specify"
                    value={otherValue}
                    onChange={(event) =>
                      onOtherChange(otherKey, event.target.value)
                    }
                  />
                )}
              </label>
            );
          })}

        {question.type === "multi" &&
          visibleOptions.map((opt) => {
            const selectedValues = Array.isArray(value) ? value : [];
            const checked = selectedValues.includes(opt.value);
            const otherKey = getOtherTextKey(question.id, opt.value);
            const otherValue = answers[otherKey] ?? "";

            return (
              <label
                key={opt.value}
                className={`
                  flex items-center gap-4 p-4 rounded-xl cursor-pointer
                  transition-all
                  ${
                    checked
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white shadow-sm hover:shadow-md"
                  }
                `}
              >
                {/* REAL CHECKBOX INPUT */}
                <input
                  type="checkbox"
                  name={question.id}
                  value={opt.value}
                  checked={checked}
                  onChange={() => {
                    // Handles max selections and exclusive options for multi-select questions.
                    const isExclusive = exclusiveValues.has(opt.value);
                    const hasExclusive = selectedValues.some((val) =>
                      exclusiveValues.has(val),
                    );

                    if (checked) {
                      onChange(
                        selectedValues.filter((val) => val !== opt.value),
                      );
                      return;
                    }

                    if (isExclusive) {
                      onChange([opt.value]);
                      return;
                    }

                    if (hasExclusive) {
                      onChange([opt.value]);
                      return;
                    }

                    if (
                      question.maxSelect &&
                      selectedValues.length >= question.maxSelect
                    ) {
                      return;
                    }

                    onChange([...selectedValues, opt.value]);
                  }}
                  className="hidden"
                />

                {/* Custom checkbox */}
                <span
                  className={`
                    h-5 w-5 rounded border-2 flex items-center justify-center
                    ${checked ? "border-white" : "border-gray-400"}
                  `}
                >
                  {checked && <span className="h-2.5 w-2.5 bg-white" />}
                </span>

                <span className="text-sm font-medium">{opt.label}</span>

                {opt.requiresText && checked && (
                  <input
                    type="text"
                    className="ml-auto w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Please specify"
                    value={otherValue}
                    onChange={(event) =>
                      onOtherChange(otherKey, event.target.value)
                    }
                  />
                )}
              </label>
            );
          })}

        {question.type === "text" && (
          <textarea
            className="w-full rounded-xl p-4 bg-white shadow-sm
               focus:ring-2 focus:ring-blue-500 outline-none"
            rows={4}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value.replace(/\d/g, ""))}
          />
        )}

        {question.type === "email" && (
  <textarea
    className="w-full rounded-xl p-4 bg-white shadow-sm
      focus:ring-2 focus:ring-blue-500 outline-none"
    rows={2}
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder="example@email.com"
  />
)}


        {question.type === "matrix" && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="p-2">Outcome Area</th>
                  {question.matrixColumns?.map((column) => (
                    <th key={column.value} className="p-2">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.matrixRows?.map((row) => {
                  const rowValue =
                    typeof value === "object" && value !== null
                      ? value[row.id]
                      : "";
                  return (
                    <tr key={row.id} className="border-t">
                      <td className="p-2 font-medium text-gray-700">
                        {row.label}
                      </td>
                      {question.matrixColumns?.map((column) => (
                        <td key={column.value} className="p-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`${question.id}-${row.id}`}
                              value={column.value}
                              checked={rowValue === column.value}
                              onChange={() => {
                                // Stores per-row selections for matrix questions.
                                const nextValue =
                                  typeof value === "object" && value !== null
                                    ? { ...value, [row.id]: column.value }
                                    : { [row.id]: column.value };
                                onChange(nextValue);
                              }}
                            />
                          </label>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

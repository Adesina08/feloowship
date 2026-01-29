export const Navigation = ({
  onPrev,
  onNext,
  isLast,
  disabled,
}: {
  onPrev?: () => void;
  onNext: () => void;
  isLast?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div className="mt-8 flex justify-between">
      {onPrev ? (
        <button
          onClick={onPrev}
          className="px-6 py-2 rounded-full bg-gray-200 text-gray-700"
        >
          Previous
        </button>
      ) : <div />}

      <button
        onClick={onNext}
        // Prevents advancing when the current question is invalid or incomplete.
        disabled={disabled}
        className={`px-6 py-2 rounded-full text-white shadow-lg ${
          disabled ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600"
        }`}
      >
        {isLast ? "Submit" : "Next"}
      </button>
    </div>
  );
};

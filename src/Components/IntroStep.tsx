export const IntroStep = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="bg-gray-100 rounded-3xl p-10 text-center shadow-[10px_10px_30px_#d1d9e6,-10px_-10px_30px_#ffffff]">
      <h1 className="text-3xl font-semibold text-gray-900">
        Evaluation of Women Empowerment Initiatives at Reliance Foundation: Women leaders India Fellowship
      </h1>

      <div className="mt-6 space-y-4 text-justify text-gray-700 leading-relaxed">
        {/* Introductory text mirrors the questionnaire wording. */}
        <p>Thank you for taking the time to participate in this survey.</p>
        <p>
          This questionnaire is part of the independent evaluation of the Women
          Leaders India (WLI) Fellowship, commissioned by the Reliance
          Foundation. The purpose of the study is to understand how the
          Fellowship has contributed to your leadership journey, professional
          growth, and the outcomes of your work.
        </p>
        <p>
          Your responses will help generate valuable insights on what is working
          well, how the programme has supported Fellows, and how future
          Fellowship cycles can be further strengthened. The survey should take
          approximately 10-15 minutes to complete. All information shared will
          be treated with strict confidentiality and reported only in aggregated
          form. Participation in this study is entirely voluntary.
        </p>
        <p>
          If you agree to participate, please select “Proceed” below to begin
          the survey.
        </p>
      </div>

      <button
        onClick={onStart}
        className="mt-8 px-8 py-3 rounded-full bg-blue-600 text-white font-medium
                   hover:bg-blue-700 transition shadow-lg"
      >
        Proceed
      </button>
    </div>
  );
};

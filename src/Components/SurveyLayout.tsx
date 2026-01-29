export const SurveyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // Centers the survey and adds responsive horizontal padding.
    <div className="flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-3xl mt-6 sm:mt-16 mb-24">
        {children}
      </div>
    </div>
  );
};

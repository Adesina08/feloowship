import { useEffect, useRef, useState } from "react";
import { SurveyLayout } from "../Components/SurveyLayout";
import { IntroStep } from "../Components/IntroStep";
import { QuestionStep } from "../Components/QuestionStep";
import { Navigation } from "../Components/Navigation";
import { surveyQuestions } from "../data/surveyQuestions";
import { ProgressBar } from "../Components/ProgressBar";
import { Confetti } from "../Components/Confetti";

const GOOGLE_SHEETS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwUJrsfsurWUK1tscNRVf942hZQIk5Ae8_dwfWkF5E7R6hMxA3Y7msmKEOxTRxHkC5X/exec";
const GOOGLE_SHEETS_TAB_NAME = "data";
const questionLookup = new Map(surveyQuestions.map((question) => [question.id, question]));

// Builds a stable key for storing "Other (specify)" text responses.
const getOtherTextKey = (questionId: string, optionValue: string | number) =>
  `${questionId}__other__${String(optionValue)}`;

const getOrCreateDeviceId = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const storageKey = "survey_device_id";
  try {
    const existing = window.localStorage.getItem(storageKey);
    if (existing) return existing;

    const generated =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

    window.localStorage.setItem(storageKey, generated);
    return generated;
  } catch {
    return "";
  }
};

export default function Survey() {
  const [step, setStep] = useState<"intro" | number>("intro");
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [, setEndTime] = useState<Date | null>(null);
  const [, setDurationMs] = useState<number | null>(null);
  const [geo, setGeo] = useState<{
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
    accuracy: number | null;
  }>({
    latitude: null,
    longitude: null,
    altitude: null,
    accuracy: null,
  });
  const [deviceId, setDeviceId] = useState("");
  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scrolls to the top of the page when navigating between questions.
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Ensures the view resets to the top whenever the step changes.
  useEffect(() => {
    if (step !== "intro") {
      scrollToTop();
    }
  }, [step]);

  useEffect(() => {
    setDeviceId(getOrCreateDeviceId());
  }, []);

  // Captures GPS details once the respondent starts the survey.
  const captureGeo = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, altitude, accuracy } = position.coords;
        setGeo({
          latitude,
          longitude,
          altitude,
          accuracy,
        });
      },
      () => {
        // If permission is denied or unavailable, keep null values.
        setGeo({
          latitude: null,
          longitude: null,
          altitude: null,
          accuracy: null,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const getOptionLabel = (questionId: string, value: any) => {
    const question = questionLookup.get(questionId);
    const option = question?.options?.find((opt) => opt.value === value);
    if (!option) {
      return value ?? "";
    }
    return option.label;
  };

  const getMatrixLabel = (questionId: string, value: any) => {
    const question = questionLookup.get(questionId);
    const column = question?.matrixColumns?.find((col) => col.value === value);
    if (!column) {
      return value ?? "";
    }
    return column.label;
  };

  // const getMultiLabels = (questionId: string, value: any) => {
  //   if (!Array.isArray(value)) return [];
  //   return value.map((entry) => getOptionLabel(questionId, entry));
  // };

  // const buildMultiCells = (
  //   questionId: string,
  //   columnBase: string,
  //   value: any
  // ) => {
  //   const labels = getMultiLabels(questionId, value);
  //   const question = questionLookup.get(questionId);
  //   const maxCells =
  //     question?.maxSelect ?? question?.options?.length ?? labels.length;
  //   const cells: Record<string, string> = {};

  //   for (let i = 0; i < maxCells; i += 1) {
  //     cells[`${columnBase} - ${i + 1}`] = labels[i] ?? "";
  //   }

  //   return cells;
  // };

  const buildMultiOptionColumns = (questionId: string, value: any) => {
    const selected = Array.isArray(value) ? value : [];
    const question = questionLookup.get(questionId);
    const options = question?.options ?? [];
    const cells: Record<string, string> = {};

    options.forEach((opt) => {
      const columnName = `${questionId}. ${opt.label}`;
      cells[columnName] = selected.includes(opt.value) ? "Yes" : "No";
    });

    return cells;
  };

  const getOtherText = (questionId: string, optionValue: string | number) => {
    const otherKey = getOtherTextKey(questionId, optionValue);
    return answers[otherKey] ?? "";
  };

  const buildSubmissionPayload = (finishedAt: Date, duration: number | null) => {
    const submissionDate = finishedAt.toISOString().split("T")[0];

    return {
      sheetName: GOOGLE_SHEETS_TAB_NAME,
      data: {
        "Submission Date": submissionDate,
        "Submission Timestamp": finishedAt.toISOString(),
        "Start Time": startTime ? startTime.toISOString() : "",
        "End Time": finishedAt.toISOString(),
        "Duration (min.ss)": duration
          ? `${Math.floor(duration / 60000)}.${String(
              Math.floor((duration % 60000) / 1000)
            ).padStart(2, "0")}`
          : "",
        "Device ID": deviceId,
        "GPS Latitude": geo.latitude ?? "",
        "GPS Longitude": geo.longitude ?? "",
        "GPS Altitude": geo.altitude ?? "",
        "GPS Accuracy": geo.accuracy ?? "",
        "QA1. Cohort": getOptionLabel("QA1", answers.QA1),
        "QB1. Age Group": getOptionLabel("QB1", answers.QB1),
        "QB2. State of Residence": answers.QB2 ?? "",
        "QB3. Years in Leadership/Initiative Work": getOptionLabel("QB3", answers.QB3),
        "QB4. Primary Fellowship Track": getOptionLabel("QB4", answers.QB4),
        "QB5. Primary Work Sector": getOptionLabel("QB5", answers.QB5),
        "QB5. Other (Specify)": getOtherText("QB5", "other"),
        "QC1. Session Attendance Level": getOptionLabel("QC1", answers.QC1),
        "QC2. One-on-One Mentorship": getOptionLabel("QC2", answers.QC2),
        "QC3. Mentor Interaction Count": getOptionLabel("QC3", answers.QC3),
        "QC4. Mentorship Helpfulness": getOptionLabel("QC4", answers.QC4),
        "QC5. Fellow Engagement Frequency": getOptionLabel("QC5", answers.QC5),
        ...buildMultiOptionColumns("QC6", answers.QC6),
        ...buildMultiOptionColumns("QC7", answers.QC7),
        "QC7. Other (Specify)": getOtherText("QC7", "other"),
        "QD1. Confidence in Influential Spaces": getOptionLabel("QD1", answers.QD1),
        "QD2. Stronger Leader": getOptionLabel("QD2", answers.QD2),
        "QD3. Comfortable with Leadership Responsibilities": getOptionLabel("QD3", answers.QD3),
        "QD4. More Likely to Speak Up": getOptionLabel("QD4", answers.QD4),
        "QD5. Increased Influence in Decisions": getOptionLabel("QD5", answers.QD5),
        "QD6. Takes Initiative More Often": getOptionLabel("QD6", answers.QD6),
        "QD7. Applies WLI Learning": getOptionLabel("QD7", answers.QD7),
        "QD8. Changed Leadership Practices": getOptionLabel("QD8", answers.QD8),
        "QD9. New/Higher Leadership Role": getOptionLabel("QD9", answers.QD9),
        "QD10. Leadership Role Location": getOptionLabel("QD10", answers.QD10),
        "QD11. Visibility/Recognition Increased": getOptionLabel("QD11", answers.QD11),
        ...buildMultiOptionColumns("QE1", answers.QE1),
        "QE1. Other (Specify)": getOtherText("QE1", "other"),
        "QE1.1. WLI Contribution to Organisational Changes": getOptionLabel(
          "QE1_1",
          answers.QE1_1
        ),
        ...buildMultiOptionColumns("QE2", answers.QE2),
        "QE2. Other (Specify)": getOtherText("QE2", "other"),
        "QE2.1. WLI Contribution to SDG/Community Changes": getOptionLabel(
          "QE2_1",
          answers.QE2_1
        ),
        ...buildMultiOptionColumns("QE3", answers.QE3),
        "QE3. Other (Specify)": getOtherText("QE3", "other"),
        "QE3.1. WLI Contribution to Longer-Term Changes": getOptionLabel(
          "QE3_1",
          answers.QE3_1
        ),
        "QF1. Useful Connections Gained": getOptionLabel("QF1", answers.QF1),
        ...buildMultiOptionColumns("QF2", answers.QF2),
        "QF3. Still Connected with RF/VV Teams": getOptionLabel("QF3", answers.QF3),
        ...buildMultiOptionColumns("QF4", answers.QF4),
        "QF4. Other (Specify)": getOtherText("QF4", "other"),
        "QG1. Confidence – Component Contributed Most": getMatrixLabel(
          "QG1",
          answers.QG1?.confidence
        ),
        "QG1. Agency & Voice – Component Contributed Most": getMatrixLabel(
          "QG1",
          answers.QG1?.agency_voice
        ),
        "QG1. Decision Influence – Component Contributed Most":
          getMatrixLabel("QG1", answers.QG1?.decision_influence),
        "QG1. Leadership Role – Component Contributed Most":
          getMatrixLabel("QG1", answers.QG1?.leadership_role),
        "QG1. Organisational Change – Component Contributed Most":
          getMatrixLabel("QG1", answers.QG1?.organisational_change),
        "QG2. Why That Component Mattered Most": answers.QG2 ?? "",
        "QH1. Biggest Enabler": getOptionLabel("QH1", answers.QH1),
        "QH1. Other (Specify)": getOtherText("QH1", "other"),
        "QH2. Biggest Challenge After WLI": getOptionLabel("QH2", answers.QH2),
        "QH2. Other (Specify)": getOtherText("QH2", "other"),
        "QH3. Suggestions to Strengthen WLI": answers.QH3 ?? "",
        ...buildMultiOptionColumns("QH4", answers.QH4),
        "QH4. Other (Specify)": getOtherText("QH4", "other"),
        ...buildMultiOptionColumns("QH5", answers.QH5),
        "QH5. Other (Specify)": getOtherText("QH5", "other"),
        ...buildMultiOptionColumns("QH6", answers.QH6),
        "QH6. Other (Specify)": getOtherText("QH6", "other"),
        "QH7. Email Address": answers.QH7 ?? "",
      },
    };
  };

  const submitToGoogleSheets = async (finishedAt: Date) => {
    const duration = startTime ? finishedAt.getTime() - startTime.getTime() : null;
    const payload = buildSubmissionPayload(finishedAt, duration);

    try {
      await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: "POST",
        // Use a simple request to avoid CORS preflight blocking the upload.
        mode: "no-cors",
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch (error) {
      console.error("Failed to submit survey response.", error);
    }
  };

  // Ensures the confetti timeout is cleaned up if the component unmounts.
  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
    };
  }, []);

  // Evaluates question-level conditions to control question visibility.
  const visibleQuestions = surveyQuestions.filter((q) => {
    // Excludes non-question informational items from the main flow.
    if (q.type === "info") return false;
    if (!q.condition) return true;
    if ("predicate" in q.condition) {
      return q.condition.predicate(answers[q.condition.questionId], answers);
    }
    if ("values" in q.condition) {
      return q.condition.values.includes(answers[q.condition.questionId]);
    }
    return answers[q.condition.questionId] === q.condition.value;
  });

  if (step === "intro") {
    return (
      <SurveyLayout>
        <IntroStep
          onStart={() => {
            const now = new Date();
            setStartTime(now);
            setStep(0);
            captureGeo();
          }}
        />
      </SurveyLayout>
    );
  }

  const question = visibleQuestions[step];
  const questionAnswer = question ? answers[question.id] : undefined;

  // Validates that the current question has a response before proceeding.
  const isAnswered = () => {
    if (!question) return false;

    if (question.type === "info") {
      return true;
    }

    if (question.type === "text") {
  if (typeof questionAnswer !== "string") return false;

  const value = questionAnswer.trim();

  // reject empty
  if (value.length === 0) return false;

  // reject ANY digit
  if (/\d/.test(value)) return false;

  // allow letters and spaces only
  return /^[A-Za-z\s]+$/.test(value);
}

if (question.type === "email") {
  if (typeof questionAnswer !== "string") return false;

  const value = questionAnswer.trim();

  // reject empty
  if (value.length === 0) return false;

  // basic email pattern: something@something.com
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(value);
}




    if (question.type === "single") {
      if (questionAnswer === null || questionAnswer === undefined || questionAnswer === "") {
        return false;
      }

      const selectedOption = question.options?.find(
        (opt) => opt.value === questionAnswer
      );
      if (selectedOption?.requiresText) {
        const otherKey = getOtherTextKey(question.id, selectedOption.value);
        const otherValue = answers[otherKey];
        return typeof otherValue === "string" && otherValue.trim().length > 0;
      }

      return true;
    }

    if (question.type === "multi") {
      if (!Array.isArray(questionAnswer) || questionAnswer.length === 0) {
        return false;
      }

      const requiresTextOptions =
        question.options?.filter(
          (opt) => opt.requiresText && questionAnswer.includes(opt.value)
        ) ?? [];

      return requiresTextOptions.every((opt) => {
        const otherKey = getOtherTextKey(question.id, opt.value);
        const otherValue = answers[otherKey];
        return typeof otherValue === "string" && otherValue.trim().length > 0;
      });
    }

    if (question.type === "matrix") {
      if (typeof questionAnswer !== "object" || questionAnswer === null) {
        return false;
      }

      return (
        question.matrixRows?.every((row) => questionAnswer[row.id]) ?? false
      );
    }

    return false;
  };

  const canProceed = isAnswered();

  if (!question) {
    // Prevents rendering when the step index is out of bounds.
    return null;
  }

  return (
    <SurveyLayout>
      <Confetti active={showConfetti} />
      <ProgressBar
      current={step}
      total={visibleQuestions.length}
      />
      {submitted ? (
        <div className="bg-gray-100 rounded-3xl p-6 sm:p-10 text-center shadow-[10px_10px_30px_#d1d9e6,-10px_-10px_30px_#ffffff]">
          {/* Submission confirmation shown inside the question bucket. */}
          <p className="text-lg font-bold text-gray-800">
            Great!
            <br />
            Thank you for participating in the survey.
          </p>
        </div>
      ) : (
        <>
          <QuestionStep
            question={question}
            value={questionAnswer}
            answers={answers}
            onChange={(val) =>
              setAnswers((prev) => ({ ...prev, [question.id]: val }))
            }
            onOtherChange={(key, val) =>
              setAnswers((prev) => ({ ...prev, [key]: val }))
            }
          />

          <Navigation
            onPrev={
              step > 0
                ? () => {
                    setStep(step - 1);
                    scrollToTop();
                  }
                : undefined
            }
            onNext={() => {
              // Blocks navigation when the current question is unanswered.
              if (!canProceed) return;
              if (step === visibleQuestions.length - 1) {
                console.log("Submit", answers);
                const finishedAt = new Date();
                setEndTime(finishedAt);
                if (startTime) {
                  setDurationMs(finishedAt.getTime() - startTime.getTime());
                }
                submitToGoogleSheets(finishedAt);
                // Triggers a brief confetti animation on successful submit.
                setShowConfetti(true);
                setSubmitted(true);
                if (confettiTimeoutRef.current) {
                  clearTimeout(confettiTimeoutRef.current);
                }
                confettiTimeoutRef.current = setTimeout(() => {
                  setShowConfetti(false);
                }, 7000);
              } else {
                setStep(step + 1);
                scrollToTop();
              }
            }}
            isLast={step === visibleQuestions.length - 1}
            disabled={!canProceed}
          />
        </>
      )}
    </SurveyLayout>
  );
}

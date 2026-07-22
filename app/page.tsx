"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneMockup } from "@/components/PhoneMockup";
import { BackgroundAmbient } from "@/components/BackgroundAmbient";
import { ProgressHeader } from "@/components/ProgressHeader";
import { QuestionCard } from "@/components/QuestionCard";
import { ChoiceButton } from "@/components/ChoiceButton";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { RatingStars } from "@/components/RatingStars";
import { RangeSlider } from "@/components/RangeSlider";
import { NotesEditor } from "@/components/NotesEditor";
import { ChipSelector } from "@/components/ChipSelector";
import { AnimatedButton } from "@/components/AnimatedButton";
import { FilmReelGallery } from "@/components/FilmReelGallery";
import { UserIdentityCard } from "@/components/UserIdentityCard";
import { submitFeedbackToGoogle } from "@/lib/googleSheets";
import { FeedbackResponse, StepId } from "@/types";
import { Utensils, Dices, Music, Trophy, MessageCircleHeart, Sparkles, Loader2, AlertCircle } from "lucide-react";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [direction, setDirection] = useState<number>(1);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Submitting state for Google Apps Script sync
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Feedback data response object with User Identity
  const [feedback, setFeedback] = useState<FeedbackResponse>({
    userName: "",
    userEmail: "",
    overallExperience: "",
    favoritePart: "",
    foodRating: 0,
    entertainmentRating: 7,
    highlight: "",
    nextYearIdeas: [],
    nextYearNotes: "",
  });

  const TOTAL_STEPS = 9;

  const goToStep = (nextStep: StepId) => {
    setDirection(nextStep > currentStep ? 1 : -1);
    setCurrentStep(nextStep);
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      goToStep((currentStep + 1) as StepId);
    }
  };

  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3500);
  };

  // Submit feedback & memory photo to Google Apps Script (Sheets + Drive)
  const handleSubmitToGoogle = async (customFeedbackData?: FeedbackResponse) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage(null);

    const submissionData: FeedbackResponse = customFeedbackData || {
      ...feedback,
      submittedAt: new Date().toISOString(),
    };

    const res = await submitFeedbackToGoogle(submissionData);

    setIsSubmitting(false);
    if (res.success) {
      setSubmitStatus("success");
      if (res.isUpdate) {
        triggerToast("Existing response updated cleanly! ✨");
      }
      if (!customFeedbackData) {
        setTimeout(() => {
          handleNext();
        }, 400);
      }
    } else {
      setSubmitStatus("error");
      setErrorMessage(res.message || "Failed to submit to Google Workspace.");
    }
  };

  // Handler specifically for uploading photo memory from Living Film Reel to Google Drive
  const handleMemoryPhotoUpload = async (imageBlobUrl: string, caption: string) => {
    const memorySubmissionPayload: FeedbackResponse = {
      ...feedback,
      userMemoryImage: imageBlobUrl,
      userMemoryCaption: caption,
      submittedAt: new Date().toISOString(),
    };

    await handleSubmitToGoogle(memorySubmissionPayload);
  };

  // Screen variants for 250ms smooth transition
  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 24 : -24,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 24 : -24,
      opacity: 0,
    }),
  };

  return (
    <PhoneMockup>
      {/* Ambient Moving Gradient Blobs */}
      <BackgroundAmbient currentStep={currentStep} />

      {/* Dynamic Header (Shrink 0) */}
      <ProgressHeader
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onBack={currentStep > 1 ? () => goToStep((currentStep - 1) as StepId) : undefined}
      />

      {/* MAIN SCREEN LAYOUT: SCROLLABLE BODY + STICKY FOOTER */}
      <div className="flex-1 flex flex-col relative overflow-hidden min-h-0 z-10">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 flex flex-col justify-between overflow-hidden min-h-0"
          >
            {/* SCREEN 1: EDITORIAL INTRO */}
            {currentStep === 1 && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-0">
                <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 bg-[#F2EEFF] text-[#5B2EFF] text-xs font-extrabold px-3.5 py-1.5 rounded-full w-fit border border-[#5B2EFF]/20 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Sugar.fit 5th Anniversary
                  </motion.div>

                  <div className="flex flex-col gap-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="text-4xl select-none w-fit"
                    >
                      🎉
                    </motion.div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D1C1A] tracking-tight leading-none">
                      One Last<br />
                      <span className="text-[#5B2EFF]">Thing...</span>
                    </h1>
                    <p className="text-base font-medium text-[#1D1C1A]/70 leading-relaxed mt-1">
                      Before you go, we’d love to hear about your evening. Let’s relive the celebration in under a minute.
                    </p>
                  </div>

                  <ImagePlaceholder
                    caption="Sugar.fit Carnival Night"
                    tagline="5th Anniversary Recap"
                    aspectRatio="aspect-[16/10]"
                  />
                </div>

                <div className="sticky bottom-0 left-0 right-0 z-30 p-4 px-6 bg-white/95 backdrop-blur-md border-t border-[#EFECE6] shadow-[0_-8px_24px_rgba(0,0,0,0.04)] pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                  <AnimatedButton onClick={handleNext} variant="primary" showArrow>
                    Begin Experience
                  </AnimatedButton>
                </div>
              </div>
            )}

            {/* SCREEN 2: USER IDENTITY STEP */}
            {currentStep === 2 && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-0">
                <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                  <QuestionCard
                    emoji="👋"
                    badgeText="Welcome"
                    accentColor="#5B2EFF"
                    title="Let's personalize your story"
                    subtitle="We'll save your responses so you can update them anytime."
                  >
                    <UserIdentityCard
                      initialName={feedback.userName}
                      initialEmail={feedback.userEmail}
                      onConfirm={(name, email) => {
                        setFeedback((prev) => ({
                          ...prev,
                          userName: name,
                          userEmail: email,
                        }));
                        setTimeout(handleNext, 200);
                      }}
                    />
                  </QuestionCard>
                </div>

                <div className="sticky bottom-0 left-0 right-0 z-30 p-4 px-6 bg-white/95 backdrop-blur-md border-t border-[#EFECE6] shadow-[0_-8px_24px_rgba(0,0,0,0.04)] pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                  <AnimatedButton
                    onClick={handleNext}
                    disabled={!feedback.userName?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feedback.userEmail || "")}
                    variant="primary"
                    showArrow
                  >
                    Continue
                  </AnimatedButton>
                </div>
              </div>
            )}

            {/* SCREEN 3: OVERALL VIBE */}
            {currentStep === 3 && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-0">
                <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                  <QuestionCard
                    emoji="✨"
                    badgeText="Vibe Check"
                    accentColor="#FF2E93"
                    title="How was the evening?"
                    subtitle="Select the emoji that best captures your vibe."
                  >
                    <div className="flex flex-col gap-3 mt-2">
                      {[
                        { label: "Amazing", emoji: "😍" },
                        { label: "Great", emoji: "😊" },
                        { label: "Good", emoji: "🙂" },
                        { label: "Average", emoji: "😐" },
                        { label: "Could've been better", emoji: "😅" },
                      ].map((option) => (
                        <ChoiceButton
                          key={option.label}
                          label={option.label}
                          emoji={option.emoji}
                          isSelected={feedback.overallExperience === option.label}
                          onClick={() => {
                            setFeedback((prev) => ({ ...prev, overallExperience: option.label }));
                            setTimeout(handleNext, 220);
                          }}
                        />
                      ))}
                    </div>
                  </QuestionCard>
                </div>

                <div className="sticky bottom-0 left-0 right-0 z-30 p-4 px-6 bg-white/95 backdrop-blur-md border-t border-[#EFECE6] shadow-[0_-8px_24px_rgba(0,0,0,0.04)] pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                  <AnimatedButton
                    onClick={handleNext}
                    disabled={!feedback.overallExperience}
                    variant="pink"
                    showArrow
                  >
                    Continue
                  </AnimatedButton>
                </div>
              </div>
            )}

            {/* SCREEN 4: FAVOURITE PART */}
            {currentStep === 4 && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-0">
                <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
                  <ImagePlaceholder
                    caption="Event Highlights"
                    tagline="Sugar.fit 5th Anniversary"
                    aspectRatio="aspect-[16/9]"
                  />

                  <QuestionCard
                    badgeText="Top Moments"
                    accentColor="#00B2FF"
                    title="What was your favourite part?"
                    subtitle="Choose your top moment from the night."
                  >
                    <div className="flex flex-col gap-2.5 mt-1">
                      {[
                        { label: "Food & Drinks", icon: <Utensils className="w-4 h-4" /> },
                        { label: "Games & Activities", icon: <Dices className="w-4 h-4" /> },
                        { label: "Music & Dancing", icon: <Music className="w-4 h-4" /> },
                        { label: "Awards Ceremony", icon: <Trophy className="w-4 h-4" /> },
                        { label: "Catching up with everyone", icon: <MessageCircleHeart className="w-4 h-4" /> },
                      ].map((item) => (
                        <ChoiceButton
                          key={item.label}
                          label={item.label}
                          icon={item.icon}
                          variant="card"
                          isSelected={feedback.favoritePart === item.label}
                          onClick={() => {
                            setFeedback((prev) => ({ ...prev, favoritePart: item.label }));
                            setTimeout(handleNext, 220);
                          }}
                        />
                      ))}
                    </div>
                  </QuestionCard>
                </div>

                <div className="sticky bottom-0 left-0 right-0 z-30 p-4 px-6 bg-white/95 backdrop-blur-md border-t border-[#EFECE6] shadow-[0_-8px_24px_rgba(0,0,0,0.04)] pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                  <AnimatedButton
                    onClick={handleNext}
                    disabled={!feedback.favoritePart}
                    variant="primary"
                    showArrow
                  >
                    Continue
                  </AnimatedButton>
                </div>
              </div>
            )}

            {/* SCREEN 5: FOOD RATING */}
            {currentStep === 5 && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-0">
                <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                  <QuestionCard
                    emoji="🍽"
                    badgeText="Culinary Rating"
                    accentColor="#FFC700"
                    title="How was the food?"
                    subtitle="Rate the culinary spread and refreshments."
                  >
                    <RatingStars
                      value={feedback.foodRating}
                      onChange={(val) => setFeedback((prev) => ({ ...prev, foodRating: val }))}
                    />
                  </QuestionCard>
                </div>

                <div className="sticky bottom-0 left-0 right-0 z-30 p-4 px-6 bg-white/95 backdrop-blur-md border-t border-[#EFECE6] shadow-[0_-8px_24px_rgba(0,0,0,0.04)] pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                  <AnimatedButton
                    onClick={handleNext}
                    disabled={feedback.foodRating === 0}
                    variant="orange"
                    showArrow
                  >
                    Continue
                  </AnimatedButton>
                </div>
              </div>
            )}

            {/* SCREEN 6: ENTERTAINMENT SLIDER */}
            {currentStep === 6 && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-0">
                <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
                  <ImagePlaceholder
                    caption="Carnival Performances"
                    tagline="Sugar.fit Stage"
                    aspectRatio="aspect-[16/9]"
                  />

                  <QuestionCard
                    emoji="🎭"
                    badgeText="Stage & Show"
                    accentColor="#FF5E2E"
                    title="How was the entertainment?"
                    subtitle="Slide to rate the energy, music, and show."
                  >
                    <RangeSlider
                      value={feedback.entertainmentRating}
                      onChange={(val) => setFeedback((prev) => ({ ...prev, entertainmentRating: val }))}
                    />
                  </QuestionCard>
                </div>

                <div className="sticky bottom-0 left-0 right-0 z-30 p-4 px-6 bg-white/95 backdrop-blur-md border-t border-[#EFECE6] shadow-[0_-8px_24px_rgba(0,0,0,0.04)] pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                  <AnimatedButton onClick={handleNext} variant="orange" showArrow>
                    Continue
                  </AnimatedButton>
                </div>
              </div>
            )}

            {/* SCREEN 7: HIGHLIGHT NOTE */}
            {currentStep === 7 && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-0">
                <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                  <QuestionCard
                    emoji="📝"
                    badgeText="Personal Story"
                    accentColor="#FF2E93"
                    title="Complete this sentence..."
                    subtitle="Share a memorable moment or story."
                  >
                    <NotesEditor
                      value={feedback.highlight}
                      onChange={(val) => setFeedback((prev) => ({ ...prev, highlight: val }))}
                      promptPrefix="The highlight of my evening was..."
                      placeholder="e.g. Seeing the team awards, the dance floor energy, or laughing during the carnival games!"
                    />
                  </QuestionCard>
                </div>

                <div className="sticky bottom-0 left-0 right-0 z-30 p-4 px-6 bg-white/95 backdrop-blur-md border-t border-[#EFECE6] shadow-[0_-8px_24px_rgba(0,0,0,0.04)] pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                  <AnimatedButton onClick={handleNext} variant="pink" showArrow>
                    {feedback.highlight.trim() ? "Continue" : "Skip / Continue"}
                  </AnimatedButton>
                </div>
              </div>
            )}

            {/* SCREEN 8: NEXT YEAR WISHLIST & INITIAL GOOGLE SHEETS SYNC */}
            {currentStep === 8 && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-0">
                <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
                  <QuestionCard
                    emoji="🔮"
                    badgeText="Looking Ahead"
                    accentColor="#00D68F"
                    title="Anything you'd love to see next year?"
                    subtitle="Select topics or add your custom ideas for Year 6."
                  >
                    <div className="flex flex-col gap-4">
                      <ChipSelector
                        options={[
                          "More carnival games 🎯",
                          "Live band / Music 🎵",
                          "Photo booth 📸",
                          "Longer party 🕺",
                          "Themed costume party 🎭",
                          "Cocktail masterclass 🍹",
                        ]}
                        selectedValues={feedback.nextYearIdeas}
                        onToggle={(item) => {
                          setFeedback((prev) => {
                            const exists = prev.nextYearIdeas.includes(item);
                            return {
                              ...prev,
                              nextYearIdeas: exists
                                ? prev.nextYearIdeas.filter((i) => i !== item)
                                : [...prev.nextYearIdeas, item],
                            };
                          });
                        }}
                      />

                      <NotesEditor
                        value={feedback.nextYearNotes}
                        onChange={(val) => setFeedback((prev) => ({ ...prev, nextYearNotes: val }))}
                        promptPrefix=""
                        placeholder="Any extra thoughts or ideas for next year..."
                      />
                    </div>
                  </QuestionCard>

                  {submitStatus === "error" && errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-[#FFF2F2] border border-[#FF4D4D]/30 rounded-[20px] flex items-center gap-3 text-xs font-bold text-[#D32F2F]"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}
                </div>

                <div className="sticky bottom-0 left-0 right-0 z-30 p-4 px-6 bg-white/95 backdrop-blur-md border-t border-[#EFECE6] shadow-[0_-8px_24px_rgba(0,0,0,0.04)] pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                  <AnimatedButton
                    onClick={() => handleSubmitToGoogle()}
                    disabled={isSubmitting}
                    variant="primary"
                    showArrow={!isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Syncing with Google Workspace...</span>
                      </div>
                    ) : (
                      <span>Enter Living Film Gallery</span>
                    )}
                  </AnimatedButton>
                </div>
              </div>
            )}

            {/* SCREEN 9: IMMERSIVE 35MM LIVING FILM REEL GALLERY */}
            {currentStep === 9 && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-0 p-1">
                <FilmReelGallery
                  onRestart={() => {
                    setFeedback({
                      userName: "",
                      userEmail: "",
                      overallExperience: "",
                      favoritePart: "",
                      foodRating: 0,
                      entertainmentRating: 7,
                      highlight: "",
                      nextYearIdeas: [],
                      nextYearNotes: "",
                    });
                    setSubmitStatus("idle");
                    goToStep(1);
                  }}
                  onTriggerToast={triggerToast}
                  onSaveMemoryPhoto={handleMemoryPhotoUpload}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-6 right-6 z-50 bg-[#1D1C1A] text-white py-3 px-4 rounded-full text-xs font-bold text-center shadow-lg border border-white/10"
          >
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>
    </PhoneMockup>
  );
}

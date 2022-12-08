import React from "react";

interface TranslationProps {
  translation: string;
}

export const DisplayTranslation = ({ translation }: TranslationProps) => {
  return (
    <div>
      <p>
        {translation[0].toString() + "_ ".repeat(translation.length - 1)} (
        {translation.length})
      </p>
    </div>
  );
};

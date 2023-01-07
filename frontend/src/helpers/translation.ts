export const transationHintString = (translation: string) => {
    const translationWordsArray = translation.split(" ");
    let transationHintString = "";
    translationWordsArray.map((translationWord, i) => {
        transationHintString =
            transationHintString +
            translationWord[0].toString() +
            "_ ".repeat(translationWord.length - 1);
        if (i < translationWordsArray.length - 1) {
            transationHintString + " ";
        }
    });
    return (
        transationHintString +
        `(${translation.length - translationWordsArray.length + 1})`
    );
};
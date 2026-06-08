const riskKeywords = {
  // High-risk threat words
  kill: 50,
  murder: 50,
  attack: 45,
  destroy: 40,
  die: 40,
  hurt: 35,
  harm: 35,

  // Aggressive / insulting language
  hate: 20,
  disgusting: 20,
  pathetic: 20,
  worthless: 20,
  idiot: 15,
  stupid: 15,
  dumb: 15,
  useless: 15,
  loser: 15,
  moron: 15,
  trash: 15,

  // Profanity / abusive words
  fuck: 20,
  fucking: 20,
  shit: 15,
  asshole: 20,
  bastard: 20,
};

const negationWords = [
  "not",
  "no",
  "never",
  "dont",
  "don't",
  "didnt",
  "didn't",
  "cannot",
  "cant",
  "can't",
];

function normalizeMessage(message) {
  return message
    .toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isNegated(words, keywordIndex) {
  const start = Math.max(0, keywordIndex - 4);
  const wordsBeforeKeyword = words.slice(start, keywordIndex);

  return wordsBeforeKeyword.some((word) => negationWords.includes(word));
}

function analyzeMessage(message) {
  const normalizedMessage = normalizeMessage(message);
  const words = normalizedMessage.split(" ");

  let score = 0;
  let matchedKeywords = [];
  let ignoredKeywords = [];

  for (const keyword in riskKeywords) {
    words.forEach((word, index) => {
      if (word === keyword) {
        if (isNegated(words, index)) {
          ignoredKeywords.push(keyword);
        } else {
          score += riskKeywords[keyword];
          matchedKeywords.push(keyword);
        }
      }
    });
  }

  matchedKeywords = [...new Set(matchedKeywords)];
  ignoredKeywords = [...new Set(ignoredKeywords)];

  let risk = "safe";

  if (score >= 50) {
    risk = "high";
  } else if (score >= 30) {
    risk = "medium";
  } else if (score >= 10) {
    risk = "low";
  }

  let explanation = "No risky keywords detected.";

  if (matchedKeywords.length > 0) {
    explanation = `Detected ${matchedKeywords.length} risk keyword(s) contributing to the ${risk} risk classification.`;
  } else if (ignoredKeywords.length > 0) {
    explanation = `Detected ${ignoredKeywords.length} risky keyword(s), but the sentence appears safe because the keyword was used with negation.`;
  }

  return {
    score,
    risk,
    matchedKeywords,
    ignoredKeywords,
    explanation,
  };
}

module.exports = {
  analyzeMessage,
};
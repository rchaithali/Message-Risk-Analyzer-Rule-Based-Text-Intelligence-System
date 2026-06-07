const riskKeywords = {
    kill: 50,
    die: 40,
    hate: 20,
    idiot: 15,
    stupid: 15,
    useless: 15
};
function analyzeMessage(message) {
    let score = 0;
    let matchedKeywords = [];

    for (const keyword in riskKeywords) {
        if (message.toLowerCase().includes(keyword)) {
            score += riskKeywords[keyword];
            matchedKeywords.push(keyword);
        }
    }

    let risk = "safe";
    if (score >= 50) {
        risk = "high";
    } else if (score >= 30) {
        risk = "medium";
    } else if (score >= 10) {
        risk = "low";
    }

    const explanation = `Detected ${matchedKeywords.length} risk keyword(s) contributing to the ${risk} risk classification.`;

    return {
        score,
        risk,
        matchedKeywords,
        explanation
    };
}
module.exports = {
    analyzeMessage
};
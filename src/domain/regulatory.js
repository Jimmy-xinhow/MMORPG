export const REVIEW_STATUS = Object.freeze({
  DRAFT: "DRAFT",
  IN_REVIEW: "IN_REVIEW",
  GO: "GO",
  GO_WITH_CHANGES: "GO_WITH_CHANGES",
  LIMITED_PILOT: "LIMITED_PILOT",
  NO_GO: "NO_GO",
  NEEDS_EXTERNAL_COUNSEL: "NEEDS_EXTERNAL_COUNSEL",
});

export const REQUIRED_REVIEW_OWNERS = Object.freeze([
  "PRODUCT",
  "ENGINEERING",
  "RISK",
  "LEGAL",
  "ACCOUNTING_TAX",
  "PAYMENT",
]);

const riskyTerms = ["提現", "現金", "外部兌換", "第三方兌換", "禮品卡", "分潤", "投資", "保證收益"];

export function createRegulatoryReview({
  id,
  featureName,
  userStory,
  jurisdictions = ["TW"],
  productFlow,
  assetFlow,
  moneyFlow,
}) {
  for (const [name, value] of Object.entries({ id, featureName, userStory, productFlow, assetFlow, moneyFlow })) {
    requiredString(value, name);
  }
  if (!Array.isArray(jurisdictions) || jurisdictions.length === 0) {
    throw new Error("jurisdictions are required");
  }

  return {
    id,
    featureName,
    userStory,
    jurisdictions,
    productFlow,
    assetFlow,
    moneyFlow,
    status: REVIEW_STATUS.DRAFT,
    opinions: [],
    noGoChecks: [],
    decisionLog: [],
    createdAt: new Date().toISOString(),
  };
}

export function submitReview(review) {
  if (review.status !== REVIEW_STATUS.DRAFT) {
    throw new Error("Only draft review can be submitted");
  }
  review.status = REVIEW_STATUS.IN_REVIEW;
  review.decisionLog.push({ action: "SUBMIT", createdAt: new Date().toISOString() });
  return review;
}

export function recordOpinion(review, { owner, decision, opinionRef, constraints = [] }) {
  if (review.status !== REVIEW_STATUS.IN_REVIEW) {
    throw new Error("Opinions can only be recorded while review is IN_REVIEW");
  }
  if (!REQUIRED_REVIEW_OWNERS.includes(owner)) {
    throw new Error(`Unsupported review owner: ${owner}`);
  }
  if (!Object.values(REVIEW_STATUS).includes(decision) || decision === REVIEW_STATUS.DRAFT || decision === REVIEW_STATUS.IN_REVIEW) {
    throw new Error(`Unsupported review decision: ${decision}`);
  }
  requiredString(opinionRef, "opinionRef");

  const existing = review.opinions.find((opinion) => opinion.owner === owner);
  if (existing) {
    Object.assign(existing, { decision, opinionRef, constraints, createdAt: new Date().toISOString() });
  } else {
    review.opinions.push({ owner, decision, opinionRef, constraints, createdAt: new Date().toISOString() });
  }
  return review;
}

export function finalizeReview(review) {
  if (review.status !== REVIEW_STATUS.IN_REVIEW) {
    throw new Error("Only IN_REVIEW can be finalized");
  }
  const missingOwners = REQUIRED_REVIEW_OWNERS.filter(
    (owner) => !review.opinions.some((opinion) => opinion.owner === owner),
  );
  if (missingOwners.length > 0) {
    throw new Error(`Missing review opinions: ${missingOwners.join(", ")}`);
  }

  if (review.opinions.some((opinion) => opinion.decision === REVIEW_STATUS.NO_GO)) {
    review.status = REVIEW_STATUS.NO_GO;
  } else if (review.opinions.some((opinion) => opinion.decision === REVIEW_STATUS.NEEDS_EXTERNAL_COUNSEL)) {
    review.status = REVIEW_STATUS.NEEDS_EXTERNAL_COUNSEL;
  } else if (review.opinions.some((opinion) => opinion.decision === REVIEW_STATUS.LIMITED_PILOT)) {
    review.status = REVIEW_STATUS.LIMITED_PILOT;
  } else if (review.opinions.some((opinion) => opinion.decision === REVIEW_STATUS.GO_WITH_CHANGES)) {
    review.status = REVIEW_STATUS.GO_WITH_CHANGES;
  } else {
    review.status = REVIEW_STATUS.GO;
  }

  review.decisionLog.push({ action: "FINALIZE", status: review.status, createdAt: new Date().toISOString() });
  return review;
}

export function runNoGoCircumventionCheck(review, proposedText) {
  requiredString(proposedText, "proposedText");
  const matchedTerms = riskyTerms.filter((term) => proposedText.includes(term));
  const result = {
    proposedText,
    matchedTerms,
    status: matchedTerms.length > 0 ? "BLOCKED" : "PASS",
    createdAt: new Date().toISOString(),
  };
  review.noGoChecks.push(result);
  return result;
}

export function assertReviewAllowsImplementation(review) {
  if (![REVIEW_STATUS.GO, REVIEW_STATUS.GO_WITH_CHANGES, REVIEW_STATUS.LIMITED_PILOT].includes(review.status)) {
    throw new Error(`Feature cannot be implemented with review status ${review.status}`);
  }
}

function requiredString(value, name) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${name} is required`);
  }
}

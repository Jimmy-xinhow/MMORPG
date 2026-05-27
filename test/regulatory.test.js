import test from "node:test";
import assert from "node:assert/strict";
import { createStore } from "../src/domain/store.js";
import { GameService } from "../src/domain/services.js";
import { REQUIRED_REVIEW_OWNERS, REVIEW_STATUS } from "../src/domain/regulatory.js";

function approveAll(service, reviewId, decision = REVIEW_STATUS.GO) {
  for (const owner of REQUIRED_REVIEW_OWNERS) {
    service.recordRegulatoryOpinion({
      reviewId,
      owner,
      decision,
      opinionRef: `docs/regulatory-reviews/demo/${owner}.md`,
    });
  }
}

test("regulated review blocks implementation before final GO", () => {
  const service = new GameService(createStore());
  const review = service.createRegulatoryReview({});
  service.submitRegulatoryReview({ reviewId: review.id });
  assert.throws(() => service.assertRegulatoryImplementationAllowed({ reviewId: review.id }), /cannot be implemented/);
  approveAll(service, review.id);
  service.finalizeRegulatoryReview({ reviewId: review.id });
  assert.deepEqual(service.assertRegulatoryImplementationAllowed({ reviewId: review.id }), {
    allowed: true,
    status: REVIEW_STATUS.GO,
  });
});

test("regulated review cannot finalize with missing owner opinions", () => {
  const service = new GameService(createStore());
  const review = service.createRegulatoryReview({});
  service.submitRegulatoryReview({ reviewId: review.id });
  service.recordRegulatoryOpinion({
    reviewId: review.id,
    owner: "PRODUCT",
    decision: REVIEW_STATUS.GO,
    opinionRef: "docs/regulatory-reviews/demo/product.md",
  });
  assert.throws(() => service.finalizeRegulatoryReview({ reviewId: review.id }), /Missing review opinions/);
});

test("no-go decision blocks implementation and circumvention wording", () => {
  const service = new GameService(createStore());
  const review = service.createRegulatoryReview({});
  service.submitRegulatoryReview({ reviewId: review.id });
  approveAll(service, review.id);
  service.recordRegulatoryOpinion({
    reviewId: review.id,
    owner: "LEGAL",
    decision: REVIEW_STATUS.NO_GO,
    opinionRef: "docs/regulatory-reviews/demo/legal.md",
  });
  service.finalizeRegulatoryReview({ reviewId: review.id });

  const check = service.checkRegulatoryCircumvention({
    reviewId: review.id,
    proposedText: "改成第三方兌換禮品卡並宣稱可提現",
  });

  assert.equal(review.status, REVIEW_STATUS.NO_GO);
  assert.equal(check.status, "BLOCKED");
  assert.throws(() => service.assertRegulatoryImplementationAllowed({ reviewId: review.id }), /NO_GO/);
});

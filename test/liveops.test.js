import test from "node:test";
import assert from "node:assert/strict";
import { createStore } from "../src/domain/store.js";
import { GameService } from "../src/domain/services.js";
import { CAMPAIGN_STATUS, CAMPAIGN_TRANSITION } from "../src/domain/liveops.js";

test("liveops campaign requires product and risk approval before activation", () => {
  const service = new GameService(createStore());
  const campaign = service.createCampaign({ rewardCopy: "遊戲道具獎勵" });
  service.advanceCampaign({ campaignId: campaign.id, transition: CAMPAIGN_TRANSITION.SUBMIT_PRODUCT_REVIEW });
  service.advanceCampaign({
    campaignId: campaign.id,
    transition: CAMPAIGN_TRANSITION.PRODUCT_APPROVE,
    actorId: "product_1",
    role: "PRODUCT_REVIEWER",
  });
  assert.throws(
    () => service.advanceCampaign({ campaignId: campaign.id, transition: CAMPAIGN_TRANSITION.ACTIVATE }),
    /Illegal campaign transition|risk approval/i,
  );
  service.advanceCampaign({
    campaignId: campaign.id,
    transition: CAMPAIGN_TRANSITION.RISK_APPROVE,
    actorId: "risk_1",
    role: "RISK_REVIEWER",
  });
  service.advanceCampaign({ campaignId: campaign.id, transition: CAMPAIGN_TRANSITION.ACTIVATE });
  assert.equal(campaign.status, CAMPAIGN_STATUS.ACTIVE);
});

test("liveops copy rejects cash-out wording", () => {
  const service = new GameService(createStore());
  assert.throws(() => service.createCampaign({ rewardCopy: "本活動保證賺錢並可提現" }), /regulated wording/);
});

test("liveops active campaign can pause, resume, and rollback with audit", () => {
  const service = new GameService(createStore());
  const campaign = service.createCampaign({ rewardCopy: "賽季稱號與遊戲道具" });
  service.advanceCampaign({ campaignId: campaign.id, transition: CAMPAIGN_TRANSITION.SUBMIT_PRODUCT_REVIEW });
  service.advanceCampaign({
    campaignId: campaign.id,
    transition: CAMPAIGN_TRANSITION.PRODUCT_APPROVE,
    actorId: "product_1",
    role: "PRODUCT_REVIEWER",
  });
  service.advanceCampaign({
    campaignId: campaign.id,
    transition: CAMPAIGN_TRANSITION.RISK_APPROVE,
    actorId: "risk_1",
    role: "RISK_REVIEWER",
  });
  service.advanceCampaign({ campaignId: campaign.id, transition: CAMPAIGN_TRANSITION.ACTIVATE });
  service.advanceCampaign({ campaignId: campaign.id, transition: CAMPAIGN_TRANSITION.PAUSE });
  service.advanceCampaign({ campaignId: campaign.id, transition: CAMPAIGN_TRANSITION.RESUME });
  service.advanceCampaign({ campaignId: campaign.id, transition: CAMPAIGN_TRANSITION.ROLLBACK, role: "ADMIN" });

  assert.equal(campaign.status, CAMPAIGN_STATUS.ROLLED_BACK);
  assert.equal(service.auditReport().auditLogCount, 8);
});

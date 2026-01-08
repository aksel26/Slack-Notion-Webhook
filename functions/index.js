/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";
// import axios from "axios";

const functions = require("firebase-functions");
require("dotenv").config();

const axios = require("axios");
const path = require("path");
// Firebase 초기화 (functions 배포 시 필요)
// admin.initializeApp();

// Slack Webhook URL (보안을 위해 Firebase Config에 저장)
const SLACK_WEBHOOK_URL = functions.config().slack.webhook_url;

// Notion 웹훅 핸들러

// .env 파일에서 매핑 정보 로드
const githubToSlackMap = JSON.parse(process.env.GITHUB_TO_SLACK_MAP || "{}");

exports.notionWebhook = functions.https.onRequest(async (req, res) => {
  try {
    // Notion에서 전송된 데이터 확인
    const imagePath = path.join(__dirname, "assets", "avatar.png");

    const notionPayload = req.body;

    // '현황' 칼럼이 '완료'로 변경되었는지 확인
    // const isStatusCompleted = notionPayload.changes.some(
    //   (change) => change.property === "진행상황" && (change.value === "✅ 완료" || change.value === "👀 테스트서버")
    // );

    // console.log("완료된거", isStatusCompleted);

    // if (isStatusCompleted) {
    // 완료된 항목의 상세 정보 추출
    const completedItem = {
      title: notionPayload.data.properties["업무 제목"].title[0].plain_text,
      attachment: notionPayload.data.properties["첨부파일"],
      status: notionPayload.data.properties["진행상황"],
      assignee: notionPayload.data.properties["개발자/담당자"],
      url: notionPayload.data.url,
      // 필요한 추가 정보 추출
    };

    const mentionUser = githubToSlackMap[completedItem.assignee.people[0].name];

    const placeholderImg = "https://api.dicebear.com/9.x/initials/svg?seed=&scale=80&backgroundColor=transparent&randomizeIds=true&chars=1";
    // Slack으로 메시지 전송

    await axios.post(SLACK_WEBHOOK_URL, {
      text: "✅ 새로운 완료 항목:",
      blocks: [
        {
          type: "context",
          elements: [
            {
              type: "image",
              image_url: completedItem.assignee.people[0].avatar_url || placeholderImg,
              alt_text: "User Avatar",
            },
            {
              type: "mrkdwn",
              text: mentionUser,
            },
          ],
        },

        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*업무명:*\n<${completedItem.url}|${completedItem.title}>`,
          },
        },

        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*진행상황:*\n${completedItem.status.status.name}`,
          },
        },

        // {
        //   type: "section",
        //   fields: [
        //     {
        //       type: "mrkdwn",
        //       text: `*진행상황:*\n${completedItem.status.name}`,
        //     },
        //     {
        //       type: "mrkdwn",
        //       text: "*담당자:*\n영업일 기준 다음날 새벽 4시 45분",
        //     },
        //   ],
        // },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "ACG HR Tech",
            },
          ],
        },
        {
          type: "divider",
        },
      ],
    });

    res.status(200).send("Processed successfully");
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(200).send("Error processing webhook");
  }
});

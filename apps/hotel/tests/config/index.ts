import { test as base } from "@playwright/test";
import { graphqlApiClient } from "../services/graphqlApiClient";
import { restApiClient } from "../services/restApiClient";

export * from "@playwright/test";

type Options = {
  graphqlApiClient: typeof graphqlApiClient;
  restApiClient: typeof restApiClient;
  attachment: void;
  logger: void;
};

export const test = base.extend<Options>({
  graphqlApiClient: ({}, use) => {
    // console.log("brefore each");

    use(graphqlApiClient); // test

    // console.log("after each");
  },
  restApiClient: ({}, use) => {
    // console.log("brefore each");

    use(restApiClient); // test

    // console.log("after each");
  },
  attachment: [
    async ({}, use, testInfo) => {
      await use();

      if (testInfo.status !== testInfo.expectedStatus) {
        console.log("OUTPUT PATH", testInfo.outputDir);

        const tracePath = testInfo.outputDir + "/trace.zip";

        testInfo.annotations.push({
          type: "testrail_attachment",
          description: tracePath,
        });
      }
    },
    {
      auto: true,
    },
  ],
  logger: [
    async ({}, use, testInfo) => {
      console.log(`Test: ${testInfo.title} is going to start`);

      await use();

      console.log(`Test: ${testInfo.title} is going to end`);
    },
    {
      auto: true,
    },
  ],
});

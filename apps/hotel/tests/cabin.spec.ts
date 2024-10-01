import { test, expect } from "@playwright/test";
import path from "path";

const uniqueCabinName = () => {
  return `${Date.now()} Cabin`;
};
const API_KEY = process.env.VITE_SUPABASE_ANON_KEY!;
test("testing the Cabin page and deleting it from UI", async ({ page }) => {
  await page.goto("/");
  const navbarContainer = page.locator("nav");
  await expect(navbarContainer).toBeVisible();

  const allLinks = navbarContainer.locator("li");
  await expect(allLinks).toHaveCount(5);

  const homeLink = allLinks.getByText("Home");
  await expect(homeLink).toBeVisible();
  await homeLink.hover();

  const cabinLink = allLinks.getByText("Cabins");
  await cabinLink.click();
  await page.waitForURL("/cabins");
  expect(page.url()).toBe("http://localhost:5173/cabins");

  const cabinHeader = page.getByLabel("cabin-header");
  await expect(cabinHeader).toBeVisible();
  await expect(cabinHeader.getByText("All cabins")).toBeVisible();
  await expect(cabinHeader.getByRole("button")).toHaveCount(3);

  //================= all,no discount,with discount buttons=====================
  const initialData = page.locator("section");
  await expect(initialData).toBeVisible();

  const initialDataCount = initialData.getByRole("row");
  console.log("initial count", await initialDataCount.count());

  const withDiscountButtons = page.getByRole("button", {
    name: "With discount",
  });
  await withDiscountButtons.click();
  const withDiscountCounts = initialData.getByRole("row");
  console.log("with discount count", await withDiscountCounts.count());
  await expect(initialData).toBeVisible();

  const withNoDiscountButtons = page.getByRole("button", {
    name: "No discount",
  });
  await withNoDiscountButtons.click();
  const withNoDiscountCounts = initialData.getByRole("row");
  console.log("with no discount count", await withNoDiscountCounts.count());
  await expect(initialData).toBeVisible();

  await page.getByRole("button", { name: "All" }).click();
  await expect(initialData).toBeVisible();

  //================delete a cabin================================
  const actionButtonInRow = initialData.locator("svg");
  expect(await actionButtonInRow.count()).toBe(await initialDataCount.count());

  const firstActionButtonInRow = actionButtonInRow.first();
  await expect(firstActionButtonInRow).toBeVisible();

  await firstActionButtonInRow.click();
  const duplicateActionDropDownMenu = page
    .getByRole("button")
    .filter({ hasText: "Duplicate" });
  await expect(duplicateActionDropDownMenu).toBeVisible();

  const EditActionDropDownMenu = page
    .getByRole("button")
    .filter({ hasText: "Edit" });
  await expect(EditActionDropDownMenu).toBeVisible();

  const deleteActionDropDownMenu = page
    .getByRole("button")
    .filter({ hasText: "Delete" });
  await expect(deleteActionDropDownMenu).toBeVisible();

  await deleteActionDropDownMenu.click();

  const deletebutton = page.getByRole("button", { name: "Delete" });
  await expect(deletebutton).toBeVisible();
  await deletebutton.click();
  // const mainBody = page.locator("body");
  // await mainBody.click();

  const deleteToast = page.getByText("Cabin successfully deleted");
  await expect(deleteToast).toBeVisible();
  await expect(initialData).toBeVisible();
  //=======================adding a cabin=====================
  // const addNewCabinButton = page.getByRole("button", { name: "Add new cabin" });
  // await expect(addNewCabinButton).toBeVisible();
  // await addNewCabinButton.click();

  // const addNewCabinFormContainer = page.locator("form");
  // await expect(addNewCabinFormContainer).toBeVisible();

  // const newCabinName = uniqueCabinName();

  // const cabinNameInputField = addNewCabinFormContainer.getByLabel("Cabin name");
  // await cabinNameInputField.fill(newCabinName);

  // const cabinMaximumCapacityInputField =
  //   addNewCabinFormContainer.getByLabel("Maximum capacity");
  // await cabinMaximumCapacityInputField.fill("10");

  // const cabinRegularPriceInputField =
  //   addNewCabinFormContainer.getByLabel("Regular price");
  // await cabinRegularPriceInputField.fill("1000");

  // const cabinDiscountInputField =
  //   addNewCabinFormContainer.getByLabel("Discount");
  // await cabinDiscountInputField.fill("100");

  // const cabinDescriptionInputField = addNewCabinFormContainer.getByLabel(
  //   "Description for website"
  // );
  // await cabinDescriptionInputField.fill("Beautiful place to live in");

  // const imagepath = path.resolve("tests/images/image-5.jpg");
  // const cabinphotoInputField =
  //   addNewCabinFormContainer.getByLabel("Cabin photo");
  // await cabinphotoInputField.setInputFiles(imagepath);

  // const createNewCabinButton = addNewCabinFormContainer.getByRole("button", {
  //   name: "Create new cabin",
  // });
  // await expect(createNewCabinButton).toBeVisible();
  // await createNewCabinButton.click();

  // const addCabinToastMessage = page.getByText("New cabin successfully created");
  // await expect(addCabinToastMessage).toBeVisible();
});

const newCabin = {
  name: "Natty",
  maxCapacity: 2,
  regularPrice: 500,
  discount: 0,
  description: "cabin for 2",
  image:
    "https://umxjivfxuijjbopalczq.supabase.co/storage/v1/object/public/cabin-images/0.4001088820184644-wallpaper-894.jpeg",
};
test("adding a new cabin by API", async ({ page, request }) => {
  const storageState = await page.context().storageState();
  console.log("storageState", storageState);

  const localStorage = storageState.origins[0].localStorage;
  console.log("localStorage", localStorage);

  const superBaseItem = localStorage.find(
    (item) => item.name === "sb-umxjivfxuijjbopalczq-auth-token"
  );
  console.log("superBaseItem", superBaseItem);

  const superBaseValue = superBaseItem?.value;
  console.log("superBaseValue", superBaseValue);

  const jsondata = superBaseValue ? JSON.parse(superBaseValue) : undefined;
  const access_token = jsondata ? jsondata["access_token"] : undefined;

  console.log("access_token", access_token);

  const response = await request.post(
    `https://umxjivfxuijjbopalczq.supabase.co/rest/v1/cabins`,
    {
      data: newCabin,
      headers: {
        Authorization: `Bearer ${access_token}`,
        Prefer: "return=representation",
        apikey: API_KEY,
      },
    }
  );
  if (response.status() === 201) {
    const data = await response.json();
    console.log("DATA", data);
    const cabinId = await data[0].id;
    console.log("Cabin Id", cabinId);
  }
});

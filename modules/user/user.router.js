import { Router } from "express";
import * as uc from "./controller/user.js";
import validation from "./../../middleware/validation.js";
import * as validators from "./user.validator.js";
import { auth } from "./../../middleware/auth.js";
import { HME, myMulter, validationTypes } from "./../../service/cloudMulter.js";
const router = Router();
router.get(
  "/shareProfile/:id",
  validation(validators.shareProfile),
  uc.shareProfile
);
router.patch(
  "/Profile",
  validation(validators.updateProfile),
  auth(),
  uc.updateProfile
);
router.delete("/Profile", validation(validators.softDelete),auth(), uc.softDelete);
router.patch(
  "/Profile/pic",validation(validators.addProfilePic),
  myMulter(validationTypes.image).single("image"),
  HME,
  auth(),
  uc.addProfilePic
);
router.patch(
  "/Profile/cov",validation(validators.addProfileCov),
  myMulter(validationTypes.image).array("image"),
  HME,
  auth(),
  uc.addProfileCov
);
router.get('/',validation(validators.getAllUsers) ,uc.getAllUsers)
export default router;
